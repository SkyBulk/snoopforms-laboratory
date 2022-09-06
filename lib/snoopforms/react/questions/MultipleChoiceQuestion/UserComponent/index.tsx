import { useEffect, useState } from "react";
import Mark from "../../toolkit/ui/Mark";
import { QuestionRadio, QuestionTitle } from "../../toolkit/ui";
import useInputValidator from "../../toolkit/base/validate";
import { MultipleChoiceQuestionConfigData, MultipleChoiceQuestionSubmissionData } from "../types";

//open to extension in the future such as conditional info
interface MultipleChoiceQuestionProps {
  config: MultipleChoiceQuestionConfigData;
  initialData: MultipleChoiceQuestionSubmissionData;
  onSubmissionChange: (data: MultipleChoiceQuestionSubmissionData) => void;
}
export default function UserComponent({ config, initialData, onSubmissionChange }: MultipleChoiceQuestionProps) {
  const { title, isRequired, onlyOne, options } = config;
  const initialList = initialData?.choiceList ?? [];
  const [choiceList, setChoiceList] = useState(initialList.length > 0 ? (onlyOne ? [initialList[0]] : initialList) : []);

  const canSubmit = isRequired ? choiceList.length > 0 : true;
  const { Validator, shouldShowReminder, hideReminder } = useInputValidator(canSubmit);
  useEffect(() => {
    //when input updates, hideReminder
    if (shouldShowReminder) hideReminder();
    //should init
    onSubmissionChange({ choiceList });
  }, [choiceList]);

  const handleSelect = (label: string) => {
    if (onlyOne) {
      //single mode
      const curChoiceLabel = choiceList[0]?.label;
      if (curChoiceLabel === label) {
        //reset
        setChoiceList([]);
      } else {
        setChoiceList([{ label, value: label }]);
      }
    } else {
      //multiple mode
      setChoiceList((prevList) => {
        const newList = [...prevList];
        const possibleIdx = prevList.findIndex((choice) => choice.label === label);
        if (possibleIdx > -1) {
          //reset
          newList.splice(possibleIdx, 1);
        } else {
          newList.push({ label, value: label });
        }
        return newList;
      });
    }
  };

  return (
    <div className="question-container" style={{ paddingBottom: "20px" }}>
      <div style={{ position: "relative" }}>
        <QuestionTitle title={title} />
        <Mark active={isRequired}></Mark>
        <Validator></Validator>
        {shouldShowReminder ? "No Empty!" : ""}
      </div>
      <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        {options.map((option, i) => (
          <div key={i} style={{ marginTop: "8px", display: "flex", alignItems: "center" }}>
            <QuestionRadio
              key={i}
              label={option.label}
              onSelect={handleSelect}
              selected={choiceList.findIndex((choice) => choice.label === option.label) > -1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
