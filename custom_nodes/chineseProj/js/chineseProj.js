import { ComfyWidgets } from '../../scripts/widgets.js'
import { app } from '../../scripts/app.js'
import { api } from '../../scripts/api.js'
import { ComfyUI } from '../../scripts/ui.js'


app.registerExtension({
    name:"chineseProj.chineseWorkflow",
    async init() {
        let menuContainer = app.ui.menuContainer
        let queuePromptBtn = menuContainer.querySelector("#queue-button")
        queuePromptBtn.textContent = "生成/排队"
        let extraOptionsLabel = queuePromptBtn.nextSibling.firstElementChild
        extraOptionsLabel.firstChild.remove()
        extraOptionsLabel.insertAdjacentHTML("afterbegin", "额外选项")
        let batchCountInputNumber = menuContainer.querySelector("#batchCountInputNumber")
        batchCountInputNumber.previousSibling.textContent = "生成批次"
        let autoQueueCheckbox = menuContainer.querySelector("#autoQueueCheckbox")
        autoQueueCheckbox.previousSibling.textContent = "自动排队"
        menuContainer.querySelector("#queue-front-button").textContent = "优先生成"
        menuContainer.querySelector("#comfy-view-queue-button").textContent = "查看队列"
        menuContainer.querySelector("#comfy-view-history-button").textContent = "查看历史"
        menuContainer.querySelector("#comfy-save-button").textContent = "保存"
        menuContainer.querySelector("#comfy-load-button").textContent = "加载"
        menuContainer.querySelector("#comfy-clear-button").textContent = "清空当前工作流"
        menuContainer.querySelector("#comfy-refresh-button").textContent = "刷新"
        menuContainer.querySelector("#comfy-clipspace-button").textContent = "剪贴板"
        menuContainer.querySelector("#comfy-load-default-button").textContent = "加载默认工作流"
        menuContainer.querySelector("#comfy-reset-view-button").textContent = "重置视图"
        function newSetStatus(status) {
            this.queueSize.textContent = "队列大小: " + (status ? status.exec_info.queue_remaining : "ERR");
            if (status) {
                if (
                    this.lastQueueSize != 0 &&
                    status.exec_info.queue_remaining == 0 &&
                    this.autoQueueEnabled &&
                    (this.autoQueueMode === "instant" || this.graphHasChanged) &&
                    !app.lastExecutionError
                ) {
                    app.queuePrompt(0, this.batchCount);
                    status.exec_info.queue_remaining += this.batchCount;
                    this.graphHasChanged = false;
                }
                this.lastQueueSize = status.exec_info.queue_remaining;
            }
        }
        ComfyUI.prototype.setStatus = newSetStatus
        app.ui.setStatus({exec_info: {queue_remaining: "X"}})

        let queue = app.ui.queue
        let history = app.ui.history
        function comfyListElementUpdatedCallback(mutationList, observer) {
            let mutation = mutationList[0]
            let target = mutation.target
            if(target === queue.element) {
                let queueActions = queue.element.querySelectorAll(".comfy-list-actions button")
                for(let i = 0; i < queueActions.length; i++) {
                    let button = queueActions[i]
                    switch(button.textContent) {
                        case "Clear Queue":
                            button.textContent = "清空队列"
                            break
                        case "Refresh":
                            button.textContent = "刷新"
                            break
                    }
                }
                let sectionHeaders = queue.element.querySelectorAll("h4")
                for(let i = 0; i < sectionHeaders.length; i++) {
                    let header = sectionHeaders[i]
                    switch(header.textContent) {
                        case "Running":
                            header.textContent = "运行中"
                            break
                        case "Pending":
                            header.textContent = "等待中"
                            break
                    }
                }
                let itemButtons = queue.element.querySelectorAll(".comfy-list-items button")
                for(let i = 0; i < itemButtons.length; i++) {
                    let button = itemButtons[i]
                    switch(button.textContent) {
                        case "Load":
                            button.textContent = "载入"
                            break
                        case "Cancel":
                            button.textContent = "取消"
                            break
                    }
                }
            } 
            if(target === history.element) {
                let historyActions = history.element.querySelectorAll(".comfy-list-actions button")
                for(let i = 0; i < historyActions.length; i++) {
                    let button = historyActions[i]
                    switch(button.textContent) {
                        case "Clear History":
                            button.textContent = "清空历史"
                            break
                        case "Refresh":
                            button.textContent = "刷新"
                            break
                    }
                }
                let sectionHeaders = history.element.querySelectorAll("h4")
                for(let i = 0; i < sectionHeaders.length; i++) {
                    let header = sectionHeaders[i]
                    switch(header.textContent) {
                        case "History":
                            header.textContent = "历史"
                            break
                    }
                }
                let itemButtons = history.element.querySelectorAll(".comfy-list-items button")
                for(let i = 0; i < itemButtons.length; i++) {
                    let button = itemButtons[i]
                    switch(button.textContent) {
                        case "Load":
                            button.textContent = "载入"
                            break
                        default:
                            button.textContent = "删除"
                            break
                    }
                }
            }
        }
        function comfyListActionsButtonClickedHandler(event) {
            switch(queue.button.textContent) {
                case "View Queue":
                    queue.button.textContent = "查看队列"
                    break
                case "Close":
                    queue.button.textContent = "关闭"
                    break
            }
            switch(history.button.textContent) {
                case "View History":
                    history.button.textContent = "查看历史"
                    break
                case "Close":
                    history.button.textContent = "关闭"
                    break
            }
        }
        const observerForComfyList = new MutationObserver(comfyListElementUpdatedCallback)
        observerForComfyList.observe(queue.element, {childList: true})
        observerForComfyList.observe(history.element, {childList: true})
        queue.button.addEventListener("click", comfyListActionsButtonClickedHandler)
        history.button.addEventListener("click", comfyListActionsButtonClickedHandler)
        await queue.load()
        await history.load()
    },
    async nodeCreated(node, app) {
        if(node.comfyClass === "LoadImage") {
            node.title = "上传说话者图片"
            let widgets = node.widgets
            for(let i = 0; i < widgets.length; i++) {
                let widget = widgets[i]
                switch(widget.name) {
                    case "image":
                        widget.label = "图片"
                        break
                    case "upload":
                        widget.label = "选择文件上传"
                        break
                }
            }
            let outputs = node.outputs
            for(let i = 0; i < outputs.length; i++) {
                let output = outputs[i]
                switch(output.name) {
                    case "IMAGE":
                        output.label = "图片"
                        break
                    case "MASK":
                        output.label = "遮罩"
                        break
                }
            }
        }
        if(node.comfyClass === "LoadAudio") {
            node.title = "上传说话者音频"
            let widgets = node.widgets
            for(let i = 0; i < widgets.length; i++) {
                let widget = widgets[i]
                switch(widget.name) {
                    case "audio":
                        widget.label = "音频"
                        break
                    case "upload":
                        widget.label = "选择文件上传"
                        break
                }
            }
            let outputs = node.outputs
            for(let i = 0; i < outputs.length; i++) {
                let output = outputs[i]
                switch(output.name) {
                    case "AUDIO":
                        output.label = "音频"
                        break
                }
            }
        }
        if(node.comfyClass === "Echo_LoadModel") {
            node.title = "EchoMimic-加载模型"
            let widgets = node.widgets
            for(let i = 0; i < widgets.length; i++) {
                let widget = widgets[i]
                switch(widget.name) {
                    case "vae":
                        widget.label = "vae模型"
                        break
                    case "denoising":
                        widget.label = "去噪声"
                        Object.assign(widget.options, { on: "是", off: "否"})
                        break
                    case "infer_mode":
                        widget.label = "推断模式"
                        break
                    case "draw_mouse":
                        widget.label = "绘画笔触"
                        Object.assign(widget.options, { on: "是", off: "否"})
                        break
                    case "motion_sync":
                        widget.label = "动作同步"
                        Object.assign(widget.options, { on: "是", off: "否"})
                        break
                    case "lowvram":
                        widget.label = "低显存模式"
                        Object.assign(widget.options, { on: "是", off: "否"})
                        break
                    default:
                        console.log(`Seems that we got an unexpected widget, whose name is ${widget.name} `)
                        break
                }
            }
            let outputs = node.outputs
            for(let i = 0; i < outputs.length; i++) {
                let output = outputs[i]
                switch(output.name) {
                    case "model":
                        output.label = "模型"
                        break
                    case "face_detector":
                        output.label = "脸部检测器"
                        break
                    case "visualizer":
                        output.label = "显形器"
                        break
                }
            }
        }
        if(node.comfyClass === "Echo_Sampler") {
            node.title = "EchoMimic-采样器"
            let inputs = node.inputs
            for(let i = 0; i < inputs.length; i++) {
                let input = inputs[i]
                switch(input.name) {
                    case "image":
                        input.label = "图片"
                        break
                    case "audio":
                        input.label = "音频"
                        break
                    case "pipe":
                        input.label = "管道"
                        break
                    case "face_detector":
                        input.label = "脸部检测器"
                        break
                    case "visualizer":
                        input.label = "显形器"
                        break
                }
            }
            let widgets = node.widgets
            for (let i = 0; i < widgets.length; i++) {
                let widget = widgets[i]
                switch(widget.name) {
                    case "video_files":
                        widget.label = "视频文件"
                        break
                    case "pose_dir":
                        widget.label = "姿势文件夹"
                        break
                    case "seeds":
                        widget.label = "种子"
                        break
                    case "cfg":
                        widget.label = "无分类引导参数"
                        break
                    case "fps":
                        widget.label = "视频帧率"
                        break
                    case "steps":
                        widget.label = "步数"
                        break
                    case "sample_rate":
                        widget.label = "采样率"
                        break
                    case "facemask_ratio":
                        widget.label = "脸部遮罩率"
                        break
                    case "facecrop_ratio":
                        widget.label = "脸部裁剪率"
                        break
                    case "context_frames":
                        widget.label = "上下文帧数"
                        break
                    case "context_overlap":
                        widget.label = "上下文重叠数"
                        break
                    case "length":
                        widget.label = "长度"
                        break
                    case "width":
                        widget.label = "宽度"
                        break
                    case "height":
                        widget.label = "高度"
                        break
                    case "audio_form_video":
                        widget.label = "音频生成视频"
                        Object.assign( widget.options, { on: "是", off: "否"})
                        break
                    case "save_video":
                        widget.label = "保存视频"
                        Object.assign( widget.options, { on: "是", off: "否"})
                        break
                    case "crop_face": 
                        widget.label = "裁剪脸部"
                        Object.assign(widget.options, { on: "是", off: "否"})
                        break
                }
            }
            let outputs = node.outputs
            for(let i = 0; i < outputs.length; i++) {
                let output = outputs[i]
                switch(output.name) {
                    case "image":
                        output.label = "图片"
                        break
                    case "audio":
                        output.label = "音频"
                        break
                    case "frame_rate":
                        output.label = "视频帧率"
                        break
                }
            }
        }
        if(node.comfyClass === "VHS_VideoCombine") {
            node.title = "VHS-视频合成"
            let inputs = node.inputs
            for(let i = 0; i < inputs.length; i++) {
                let input = inputs[i]
                switch(input.name) {
                    case "images":
                        input.label = "图片"
                        break
                    case "audio":
                        input.label = "音频"
                        break
                    case "meta_batch":
                        input.label = "元堆"
                        break
                    case "vae":
                        input.label = "vae模型"
                        break
                }
            }
            let widgets = node.widgets
            for (let i = 0; i < widgets.length; i++) {
                let widget = widgets[i]
                switch(widget.name) {
                    case "frame_rate":
                        widget.label = "视频帧率"
                        break
                    case "loop_count":
                        widget.label = "循环次数"
                        break
                    case "filename_prefix":
                        widget.label = "文件名前缀"
                        break
                    case "format":
                        widget.label = "格式"
                        break
                    case "pix_fmt":
                        widget.label = "像素格式"
                        break
                    case "crf":
                        widget.label = "crf"
                        break
                    case "save_metadata":
                        widget.label = "保存元数据"
                        Object.assign(widget.options, { on: "是", off: "否"})
                        break
                    case "pingpong":
                        widget.label = "pingpong"
                        Object.assign(widget.options, { on: "是", off: "否"})
                        break
                    case "save_output":
                        widget.label = "保存视频"
                        Object.assign(widget.options, { on: "是", off: "否"})
                        break
                }
            }
            let outputs = node.outputs
            for(let i = 0; i < outputs.length; i++) {
                let output = outputs[i]
                switch(output.name) {
                    case "Filenames":
                        output.label = "文件名"
                        break
                }
            }
        }
    }
})

let progressMessageNode = null

async function getTerminalColumns() {
    const resp = await api.fetchApi("/chineseProj/getTerminalColumns", {
        method: "GET", 
        cache: "no-store"
    })
    if(resp.status === 200) {
        let respJson = await resp.json()
        return respJson.columns
    } else {
        throw new Error("Failed to get terminal columns")
    }
}

async function getProgressMessageNodeWidth() {
    // Create a temporary span to measure the width of a character
    const span = document.createElement('span');
    span.style.fontSize = LiteGraph.NODE_TEXT_SIZE + 'px';
    span.style.visibility = 'hidden';
    span.style.whiteSpace = 'pre';
    span.textContent = 'a';  // Use a single character for measurement

    document.body.appendChild(span);
    const charWidth = span.getBoundingClientRect().width;
    document.body.removeChild(span);
    let terminalColumns = await getTerminalColumns()
    // Calculate the total width required for the desired number of columns
    const textareaWidth = Math.ceil(charWidth * terminalColumns);

    return textareaWidth
}

let progressMessageNodeWidth = await getProgressMessageNodeWidth()

app.registerExtension({
    name: "chineseProj.displayProgressMessage",
    async registerCustomNodes() {
        class ProgressMessageNode {
            color = LGraphCanvas.node_colors.green.color
            bgcolor = LGraphCanvas.node_colors.green.bgcolor
            groupcolor = LGraphCanvas.node_colors.green.groupcolor
            title = "流程信息节点"
            collapsable = true
            category = "chineseProj"
        
            constructor() {
                if(progressMessageNode) {
                    let deleteExistingPmn = confirm("检测到流程信息节点已经创建, 如果继续创建将会删除旧节点，是否继续")
                    if(deleteExistingPmn) {
                        app.graph.remove(progressMessageNode)
                        progressMessageNode = null
                    } else {
                        return 
                    }
                }
                this.onRemoved = function() {
                    progressMessageNode = null
                }
                this.messages = {
                    title: "",
                    contents: []
                }

                if(!this.properties) {
                    this.properties = {}
                    this.properties.text = ""
                }
                ComfyWidgets.STRING(this, "title", ["", {}], app)
                ComfyWidgets.STRING(this, "messages", ["", {default: this.properties.text, multiline: true}], app)
                ComfyWidgets.INT(this, "lines", ["", {default: 10, min: 5, max: 20, step: 1}], app)

                let self = this
                this.serialize_widgets = false
                this.isVirtualNode = true
                let widgets = this.widgets
                for(let i = 0 ; i < widgets.length; i++) {
                    let widget = widgets[i]
                    if(widget.name === "title") {
                        widget.label = "标题"
                    }
                    if(widget.name === "lines") {
                        widget.label = "显示行数"
                    }
                }
                progressMessageNode = this
            }
        }

        LiteGraph.registerNodeType(
            "ProgressMessage", ProgressMessageNode
        )
    },
    async setup() {
        function progressMessageHandler(event) {
            if(progressMessageNode) {
                let message = event.detail
                if(message.title === progressMessageNode.messages.title) {
                    let dispLines = progressMessageNode.widgets[progressMessageNode.widgets.findIndex( widget => widget.name === "lines")]
                    if(dispLines <= progressMessageNode.messages.contents.length) {
                        progressMessageNode.messages.contents.shift()
                    }
                } else {
                    progressMessageNode.messages.title = message.title
                    progressMessageNode.messages.contents.length = 0
                }
                progressMessageNode.messages.contents.push(message.message)
                let titleWidget = progressMessageNode.widgets[progressMessageNode.widgets.findIndex( widget => widget.name === "title")]
                let messagesWidget = progressMessageNode.widgets[progressMessageNode.widgets.findIndex( widget => widget.name === "messages")]
                titleWidget.value = progressMessageNode.messages.title
                messagesWidget.value = [...progressMessageNode.messages.contents].join("")
            }
        }
        api.addEventListener("progressMessage", progressMessageHandler)

        function executionStartHander(event) {
            if(progressMessageNode) {
                let dispLines = progressMessageNode.widgets[progressMessageNode.widgets.findIndex( widget => widget.name === "lines")].value
                progressMessageNode.size[0] = progressMessageNodeWidth || 300
                progressMessageNode.size[1] = Math.max(Math.ceil((dispLines + 4)* LiteGraph.NODE_SLOT_HEIGHT / 1.3), 150)
                progressMessageNode.widgets[progressMessageNode.widgets.findIndex( widget => widget.name === "messages")].element.rows = dispLines
            }
            let newEvent = new CustomEvent("execution_start", {
                detail: {
                    title: "工作流启动",
                    message: `Prompt ID: ${event.detail.prompt_id}` 
                }
            })
            progressMessageHandler(newEvent)
        }
        api.addEventListener("execution_start", executionStartHander)

        function executingHandler(event) {
            let executingNodeId = event.detail
            let nodeTitle = app.graph._nodes_by_id[executingNodeId]?.title || "进入下一节点"
            let newEvent = new CustomEvent("execution_start", {
                detail: {
                    title: nodeTitle,
                    message: `正在执行节点${nodeTitle}中...` 
                }
            })
            progressMessageHandler(newEvent)
        }
        api.addEventListener("executing", executingHandler)

        function executedHandler(event) {
            let newEvent = new Event("execution_start", {
                detail: {
                    title: "此次工作流结束运行",
                    message: `结果：${event.output}` 
                }
            })
            progressMessageHandler(newEvent)
        }
        api.addEventListener("executed", executingHandler)
    }
})

