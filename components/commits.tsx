import { useEffect, useRef } from "react";
import * as vis from "vis-network";
import { DataSet } from "vis-data";
import { PushEvent } from "../lib/github/api";
import useEventSource from "../lib/useEventSource";

interface RepositoryNode extends vis.Node {
  repository: string;
}

interface CommitNode extends vis.Node {
  sha: string;
}

type AllNodes = RepositoryNode | CommitNode;

const defaultRepository: vis.Node = {
  color: {
    background: "#007C2E",
    border: "#06893A",
  },
  font: {
    color: "#FFFFFF",
  },
  shape: "circle",
};
const defaultCommit: vis.Node = {
  font: {
    color: "#262626",
  },
  color: {
    background: "#EBFCFF",
    border: "#368DA8",
  },
  shape: "box",
};

const displayedNodes: vis.DataSet<AllNodes> = new DataSet();
const displayedEdges: vis.DataSetEdges = new DataSet();

export default function Commits() {
  const { connected } = useEventSource<PushEvent>("/api/commits", handleEvent);
  const target = useRef(null);
  const network = useRef<vis.Network>();

  useEffect(() => {
    const options: vis.Options = {
      autoResize: true,
    };

    if (target.current == null) return;
    network.current = new vis.Network(
      target.current,
      {
        nodes: displayedNodes,
        edges: displayedEdges,
      },
      options
    );
  }, []);

  function handleEvent(event: PushEvent) {
    const repositoryId = event.repository.node_id;
    if (!displayedNodes.get(repositoryId)) {
      displayedNodes.add({
        ...defaultRepository,
        id: repositoryId,
        label: event.repository.full_name,
        repository: event.repository.full_name,
      });
    }

    const commits = [event.after];
    commits.forEach((commit) => {
      if (!displayedNodes.get(commit)) {
        displayedNodes.add({
          ...defaultCommit,
          id: commit,
          label: commit,
          sha: commit,
        });
      }

      displayedEdges.add({
        id: repositoryId + commit,
        from: repositoryId,
        to: commit,
      });
    });

    network.current?.fit();
  }

  return (
    <>
      {connected ? "Følger med" : "Venter på at noen koder litt"}
      <div ref={target} style={{ height: "100vh" }}></div>;
    </>
  );
}
