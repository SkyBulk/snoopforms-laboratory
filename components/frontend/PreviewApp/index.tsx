import { useMemo } from "react";
import { generateId } from "@/lib/utils";
import Loading from "@/components/layout/Loading";
import { BlockData } from "@/lib/types";
import { toast } from "react-toastify";
import { SnoopForm, SnoopPage, SnoopElement } from "@/lib/snoopforms/react";
import clsx from "clsx";
export default function PreviewApp({ formId, blocks }: { formId: string; blocks: BlockData[] }) {
  console.log("RENDER PreviewApp", formId, blocks);
  const pages = useMemo(() => {
    const allPages: Page[] = [];
    let cPage: Page = { id: generateId(10), blocks: [] };
    blocks.forEach((cBlock) => {
      cPage.blocks.push(cBlock);
      if (cBlock.type === "pageTransition") {
        //generate a new Page
        allPages.push(cPage);
        cPage = { id: generateId(10), blocks: [] };
      }
    });
    //TODO make it configurable
    //the last Page, add a Done Button by default
    if (cPage.blocks.length > 0) {
      cPage.blocks.push({ id: generateId(10), type: "pageTransition", data: { _component: { submitLabel: "DONE" } } });
      allPages.push(cPage);
    }
    return allPages;
  }, [blocks, formId]);

  const handleFormCompleted = () => {
    toast("Congratulations! You Have Finished the Form 🎉", { autoClose: 2000 });
  };

  if (!pages) return <Loading />;
  else {
    // console.log("RENDER FormApp", pages);
    return (
      <div className={clsx("preview-app", "w-full h-full px-5 py-5 mb-[10vh]")}>
        <SnoopForm offline={true} formId={formId} onDone={handleFormCompleted}>
          {pages.map((page, _) => (
            <SnoopPage name={page.id} key={page.id}>
              {page.blocks.map((block, i) => (
                <SnoopElement
                  key={block.id ?? i}
                  type={block.type}
                  id={block.id}
                  config={["paragraph", "header"].includes(block.type) ? block.data : block.data?._component}
                />
              ))}
            </SnoopPage>
          ))}
        </SnoopForm>
        <div className={clsx("block-placeholder-incase-overflow", "w-full h-[48px]")}></div>
      </div>
    );
  }
}
type Page = {
  id: string;
  blocks: BlockData[];
};
