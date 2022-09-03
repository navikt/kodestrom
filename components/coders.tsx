import { useEffect, useRef } from "react";
import * as vis from "vis-network";
import { DataSet } from "vis-data";
import { PushEvent } from "../lib/github/api";
import useEventSource from "../lib/useEventSource";

interface RepositoryNode extends vis.Node {
  repository: string;
}

interface CoderNode extends vis.Node {
  handle: string;
  photo: string;
  url: string;
}

type AllNodes = RepositoryNode | CoderNode;

const defaultRepository: vis.Node = {
  color: {
    background: "#007C2E",
    border: "#06893A",
  },
  font: {
    color: "#FFFFFF",
  },
  shape: "box",
  borderWidth: 3,
};
const defaultCoder: vis.Node = {
  font: {
    color: "#262626",
  },
  color: {
    background: "#EBFCFF",
    border: "#368DA8",
  },
  shape: "circularImage",
};

const displayedNodes: vis.DataSet<AllNodes> = new DataSet();
const displayedEdges: vis.DataSetEdges = new DataSet();

export default function Coder() {
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

    const coder = event.sender;
    if (!displayedNodes.get(coder.node_id)) {
      displayedNodes.add({
        ...defaultCoder,
        id: coder.node_id,
        //label: coder.login,
        handle: coder.login,
        photo: coder.avatar_url || coder.gravatar_id,
        image: coder.avatar_url || coder.gravatar_id,
        url: coder.html_url,
      });
    }

    const edge = displayedEdges.get(repositoryId + coder.node_id);
    if (edge) {
      edge.value = 1 + (edge.value || 1);
      displayedEdges.update(edge);
    } else {
      displayedEdges.add({
        id: repositoryId + coder.node_id,
        from: repositoryId,
        to: coder.node_id,
        value: 1,
      });
    }

    network.current?.fit();
  }

  return (
    <>
      {connected ? "Følger med" : "Venter på at noen koder litt"}
      <div ref={target} style={{ height: "100vh" }}></div>;
    </>
  );
}
