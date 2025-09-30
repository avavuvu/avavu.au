import { defineMarkdocConfig, nodes, component, type Render, type AstroMarkdocConfig } from '@astrojs/markdoc/config';
import Markdoc, { type Config} from '@markdoc/markdoc';
import cloneDeep from "lodash/cloneDeep.js"

const astroMarkdocConfig: AstroMarkdocConfig = {
  nodes: {
    image: {
      ...nodes.image,
      render: component("@/writing/MarkdocImage.astro"),
    },
  },
  tags: {
    tiktok: {
      attributes: {
        videoid: { type: String}
      },
      transform(node, config) {
          const attributes = node.transformAttributes(config);
          const videoid: string = attributes["videoid"]

          return  new  Markdoc.Tag(
            `lite-tiktok`,
            {
              videoid
            },
          )
      },
    },
    video: {
      attributes: {
        src: { type: String },
        type: { type: String, default: "video/mp4"}
      },
      transform(node, config) {
          const attributes = node.transformAttributes(config);

          const source = new Markdoc.Tag(
            "source",
            { 
              src: attributes.src,
              type: attributes.type 
            }
          )
        
          return new Markdoc.Tag(
            "video",
            {
              controls: true,
            },
            [ source ]
          )
      },
    },
    youtube: {
      attributes: {
        watch: { type: String },
        start: { type: Number }
      },
      transform(node, config) {
          const attributes = node.transformAttributes(config);
          const watch: string = attributes["watch"]
          const start: number | undefined = attributes["start"]

          // LAZY
          const out: any = {
            videoid: watch,
          }

          if(start) {
            out["params"] = `start=${start}`
          }

          return  new  Markdoc.Tag(
            `lite-youtube`,
            out,
          )
      },
    },
    "note-content": {
      attributes: {
        i: { type: String }
      },
      transform() {
          return new Markdoc.Tag()
      },
    },
    note: {
      render: component("@/writing/Sidenote.astro"),
      attributes: {
        i: { type: String }
      },
      selfClosing: true,
      inline: true,
    },
    full: {
      render: "div",
      attributes: {
        class: { type: String, default: "full" }
      }
    },
    most: {
      render: "div",
      attributes: {
        class: { type: String, default: "most" }
      }
    },
    attribution: {
      render: "figure",
      transform: (node, config) => {
        const attributes = node.transformAttributes(config);

        const caption = node.children.find(child => child.tag === "from")

        const figure = caption 
          ? new Markdoc.Tag("figcaption", {}, [Markdoc.transform(caption)]) 
          : undefined

        const otherNodes = node.children.filter((child) => child.tag !== "from")
        const transformedNodes = otherNodes.map((node) => Markdoc.transform(node, config)).flat().filter(node => node !== null)

        return  new  Markdoc.Tag(
          `figure`,
          { ...attributes },
          figure ? [...transformedNodes, figure] : [...transformedNodes]
        )
      }
    },
    from: {
      render: "div",
      attributes: {
        class: { type: String, default: "from" }
      }
    }
  }
} as const

const clonedConfig: AstroMarkdocConfig = cloneDeep(astroMarkdocConfig)

for (const nodeConfig of Object.values(clonedConfig.nodes!)) {
    if (nodeConfig.render && typeof nodeConfig.render !== 'string') {
      nodeConfig.render = 'span';
    }
}

for (const nodeConfig of Object.values(clonedConfig.tags!)) {
    if (nodeConfig.render && typeof nodeConfig.render !== 'string') {
      nodeConfig.render = 'span';
    }
}

const standardMarkdocConfig = clonedConfig as Config

export { standardMarkdocConfig }

export default defineMarkdocConfig(astroMarkdocConfig);