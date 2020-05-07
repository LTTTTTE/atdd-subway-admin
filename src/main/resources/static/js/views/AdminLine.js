import {EVENT_TYPE} from "../../utils/constants.js";
import {colorSelectOptionTemplate, subwayLineInfoTemplate, subwayLinesTemplate} from "../../utils/templates.js";
import {defaultSubwayLines} from "../../utils/subwayMockData.js";
import {subwayLineColorOptions} from "../../utils/defaultSubwayData.js";
import Modal from "../../ui/Modal.js";
import api from "../../api/index.js";

function AdminLine() {
    const $subwayLineList = document.querySelector("#subway-line-list");
    const $subwayLineNameInput = document.querySelector("#subway-line-name");
    const $subwayLineStartTimeInput = document.querySelector("#subway-first-time");
    const $subwayLineEndTimeInput = document.querySelector("#subway-last-time");
    const $subwayLineIntervalTimeInput = document.querySelector("#subway-interval-time");
    const $subwayLineColorInput = document.querySelector("#subway-line-color");

    const $createSubwayLineButton = document.querySelector(
        "#subway-line-create-form #submit-button"
    );
    const subwayLineModal = new Modal();

    const onCreateSubwayLine = event => {
        event.preventDefault();
        const newSubwayLine = {
            title: $subwayLineNameInput.value,
            startTime: $subwayLineStartTimeInput.value,
            endTime: $subwayLineEndTimeInput.value,
            intervalTime: $subwayLineIntervalTimeInput.value,
            bgColor: $subwayLineColorInput.value
        };
        $subwayLineList.insertAdjacentHTML(
            "beforeend",
            subwayLinesTemplate(newSubwayLine)
        );
        subwayLineModal.toggle();
        $subwayLineNameInput.value = "";
        $subwayLineStartTimeInput.value = "";
        $subwayLineEndTimeInput.value = "";
        $subwayLineIntervalTimeInput.value = "";
        $subwayLineColorInput.value = "";
        api.line.create(newSubwayLine);
    };

    const onDeleteSubwayLine = async event => {
        const $target = event.target;
        const isDeleteButton = $target.classList.contains("mdi-delete");
        if (isDeleteButton) {
            const $targetLine = $target.parentNode.parentNode; //TODO 더 좋은 방법이..
            const targetLineTitle = $targetLine.textContent.trim();
            $target.closest(".subway-line-item").remove();
            const lineByTitle = await findSubwayLineByTitle(targetLineTitle);
            if (lineByTitle !== null) {
                await api.line.delete(lineByTitle.id);
            }
        }
    };

    const onEditSubwayLine = async event => {
        const $target = event.target;
        const isUpdateButton = $target.classList.contains("mdi-pencil");
        //if(isUpdateButton)
        const editSubwayLine = {
            title: $subwayLineNameInput.value,
            startTime: $subwayLineStartTimeInput.value,
            endTime: $subwayLineEndTimeInput.value,
            intervalTime: $subwayLineIntervalTimeInput.value,
            bgColor: $subwayLineColorInput.value
        };
        $subwayLineNameInput.value = "";
        $subwayLineStartTimeInput.value = "";
        $subwayLineEndTimeInput.value = "";
        $subwayLineIntervalTimeInput.value = "";
        $subwayLineColorInput.value = "";
        await api.line.update(editSubwayLine, lineId);
    };

    const showSubwayLineInfo = async event => {
        const $target = event.target;
        const $subwayLinesInfo = document.querySelector(".lines-info");
        const isShowButton = $target.classList.contains("subway-line-item");
        const targetLineTitle = $target.textContent.trim()
        if (isShowButton) {
            const lineByTitle = await findSubwayLineByTitle(targetLineTitle);
            if (lineByTitle !== null) {
                $subwayLinesInfo.innerHTML = subwayLineInfoTemplate(lineByTitle);
            }
        }
    };

    const findSubwayLineByTitle = async title => {
        const lines = await api.line.get();
        return lines.find(line => line.title === title);
    }

    const onUpdateSubwayLine = async event => {
        const $target = event.target;
        const isEditButton = $target.classList.contains("mdi-pencil");
        if (isEditButton) {
            subwayLineModal.toggle();
            const $targetLine = $target.parentNode.parentNode; //TODO 더 좋은 방법이..
            const lines = await api.line.get();
            let lineId = 0;
            lines.map(line => {
                if (line.title === $targetLine.textContent.trim()) {
                    lineId = line.id;
                    $subwayLineNameInput.value = line.title;
                    $subwayLineStartTimeInput.value = line.startTime.slice(0, -3);
                    $subwayLineEndTimeInput.value = line.endTime.slice(0, -3);
                    $subwayLineIntervalTimeInput.value = line.intervalTime;
                    $subwayLineColorInput.value = line.bgColor;
                }
            });
        }
    };

    const initDefaultSubwayLines = () => {
        defaultSubwayLines.map(line => {
            $subwayLineList.insertAdjacentHTML(
                "beforeend",
                subwayLinesTemplate(line)
            );
        });
    };

    const initSubwayLines = async () => {
        const lines = await api.line.get();
        lines.map(line => {
            $subwayLineList.insertAdjacentHTML(
                "beforeend",
                subwayLinesTemplate(line)
            );
        })

    }

    const initEventListeners = () => {
        $subwayLineList.addEventListener(EVENT_TYPE.CLICK, onDeleteSubwayLine);
        $subwayLineList.addEventListener(EVENT_TYPE.CLICK, onUpdateSubwayLine);
        $subwayLineList.addEventListener(EVENT_TYPE.CLICK, showSubwayLineInfo);
        $createSubwayLineButton.addEventListener(EVENT_TYPE.CLICK, onCreateSubwayLine);
    };

    const onSelectColorHandler = event => {
        event.preventDefault();
        const $target = event.target;
        if ($target.classList.contains("color-select-option")) {
            document.querySelector("#subway-line-color").value =
                $target.dataset.color;
        }
    };

    const initCreateSubwayLineForm = () => {
        const $colorSelectContainer = document.querySelector(
            "#subway-line-color-select-container"
        );
        const colorSelectTemplate = subwayLineColorOptions
            .map((option, index) => colorSelectOptionTemplate(option, index))
            .join("");
        $colorSelectContainer.insertAdjacentHTML("beforeend", colorSelectTemplate);
        $colorSelectContainer.addEventListener(
            EVENT_TYPE.CLICK,
            onSelectColorHandler
        );
    };

    this.init = () => {
        // initDefaultSubwayLines();
        initSubwayLines();
        initEventListeners();
        initCreateSubwayLineForm();
    };
}

const adminLine = new AdminLine();
adminLine.init();
