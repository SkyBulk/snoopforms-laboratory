import { API, BlockTool, BlockToolData, ToolConfig } from "../../toolkit/types/editorjs";
import BuilderComponent, { RatingQuestionConfigData } from "../BuilderComponent";
import ReactDOM from "react-dom";
interface RatingQuestionData extends BlockToolData {
  label: string;
  placeholder: string;
  required: boolean;
}
//extends RatingComponentConfigData
interface RatingQuestionData {
  questionId?: string;
}
//extends RatingComponentConfigData
interface RatingQuestionData {
  _component: RatingQuestionConfigData;
}
export default class RatingQuestion implements BlockTool {
  rootNode: undefined | HTMLElement;
  api: API;
  data: RatingQuestionData;
  constructor({ data, api }: { api: API; config?: ToolConfig; data?: RatingQuestionData }) {
    this.rootNode = undefined;
    this.api = api;

    this.data = {
      label: data?.label ?? "",
      placeholder: data?.placeholder ?? "",
      required: data?.required ?? true,
      questionId: data?.questionId,
      //as initialData
      _component: {
        title: data?._component?.title ?? "",
        num: data?._component?.num ?? 5,
        icon: data?._component?.icon ?? "stars",
        isRequired: data?._component?.isRequired ?? false,
      },
    };
  }
  static get toolbox() {
    return {
      title: "Rating Question",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }
  save(block: HTMLElement) {
    return this.data;
  }
  render(): HTMLElement {
    //what if init this.wrapper in the constructor
    this.rootNode = document.createElement("div");
    this.rootNode.classList.add("block-root");
    const handleDataChange = (data: RatingQuestionConfigData) => {
      this.data._component = data;
      console.log("RatingQuestion handleDataChange", data, this.data);
    };
    ReactDOM.render(<BuilderComponent onDataChange={handleDataChange} initialData={this.data._component} />, this.rootNode);
    return this.rootNode;
  }
}
