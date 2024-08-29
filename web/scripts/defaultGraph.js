export const defaultGraph = {
	last_node_id: 7,
	last_link_id: 7,
	nodes: [
	  {
		id: 4,
		type: "Echo_LoadModel",
		pos: [1216, 157],
		size: { 0: 315, 1: 218 },
		flags: {},
		order: 0,
		mode: 0,
		outputs: [
		  { name: "model", type: "MODEL", links: [3], shape: 3, label: "模型", slot_index: 0 },
		  { name: "face_detector", type: "MODEL", links: [4], shape: 3, label: "脸部检测器", slot_index: 1 },
		  { name: "visualizer", type: "MODEL", links: [5], shape: 3, label: "显形器", slot_index: 2 }
		],
		title: "EchoMimic-加载模型",
		properties: { "Node name for S&R": "Echo_LoadModel" },
		widgets_values: ["stabilityai/sd-vae-ft-mse", true, "audio_drived", false, false, false]
	  },
	  {
		id: 6,
		type: "VHS_VideoCombine",
		pos: [142, 571],
		size: [579.3699951171875, 310],
		flags: {},
		order: 5,
		mode: 0,
		inputs: [
		  { name: "images", type: "IMAGE", link: 6, label: "图片" },
		  { name: "audio", type: "AUDIO", link: 7, label: "音频" },
		  { name: "meta_batch", type: "VHS_BatchManager", link: null, label: "元堆" },
		  { name: "vae", type: "VAE", link: null, label: "vae模型" }
		],
		outputs: [
		  { name: "Filenames", type: "VHS_FILENAMES", links: null, shape: 3, label: "文件名" }
		],
		title: "VHS-视频合成",
		properties: { "Node name for S&R": "VHS_VideoCombine" },
		widgets_values: {
		  frame_rate: 24,
		  loop_count: 0,
		  filename_prefix: "AnimateDiff",
		  format: "video/h264-mp4",
		  pix_fmt: "yuv420p",
		  crf: 19,
		  save_metadata: true,
		  pingpong: false,
		  save_output: true,
		  videopreview: { hidden: false, paused: false, params: { filename: "AnimateDiff_00008-audio.mp4", subfolder: "", type: "output", format: "video/h264-mp4", frame_rate: 24 }, muted: false }
		}
	  },
	  {
		id: 7,
		type: "ProgressMessage",
		pos: [800.8003295898428, 785.8003295898433],
		size: { 0: 498, 1: 216 },
		flags: {},
		order: 1,
		mode: 0,
		title: "流程信息节点",
		properties: { text: "" },
		color: "#232",
		bgcolor: "#353"
	  },
	  {
		id: 5,
		type: "Echo_Sampler",
		pos: [802, 144],
		size: { 0: 315, 1: 522 },
		flags: {},
		order: 4,
		mode: 0,
		inputs: [
		  { name: "image", type: "IMAGE", link: 1, label: "图片" },
		  { name: "audio", type: "AUDIO", link: 2, label: "音频" },
		  { name: "pipe", type: "MODEL", link: 3, label: "管道" },
		  { name: "face_detector", type: "MODEL", link: 4, label: "脸部检测器" },
		  { name: "visualizer", type: "MODEL", link: 5, label: "显形器" }
		],
		outputs: [
		  { name: "image", type: "IMAGE", links: [6], shape: 3, label: "图片", slot_index: 0 },
		  { name: "audio", type: "AUDIO", links: [7], shape: 3, label: "音频", slot_index: 1 },
		  { name: "frame_rate", type: "FLOAT", links: null, shape: 3, label: "视频帧率" }
		],
		title: "EchoMimic-采样器",
		properties: { "Node name for S&R": "Echo_Sampler" },
		widgets_values: ["none", "none", 0, 2.5, 30, 24, 16000, 0.1, 0.5, 12, 3, true, 120, 512, 512, false, false]
	  },
	  {
		id: 2,
		type: "LoadImage",
		pos: [151, 138],
		size: { 0: 215, 1: 314 },
		flags: {},
		order: 2,
		mode: 0,
		outputs: [
		  { name: "IMAGE", type: "IMAGE", links: [1], shape: 3, label: "图片", slot_index: 0 },
		  { name: "MASK", type: "MASK", links: null, shape: 3, label: "遮罩" }
		],
		title: "上传说话者图片",
		properties: { "Node name for S&R": "LoadImage" },
		widgets_values: ["201142.webp", "image"]
	  },
	  {
		id: 3,
		type: "LoadAudio",
		pos: [401, 143],
		size: { 0: 322, 1: 165 },
		flags: {},
		order: 3,
		mode: 0,
		outputs: [
		  { name: "AUDIO", type: "AUDIO", links: [2], shape: 3, label: "音频", slot_index: 0 }
		],
		title: "上传说话者音频",
		properties: { "Node name for S&R": "LoadAudio" },
		widgets_values: ["jianyuCommentOnKDShort.WAV", null, ""]
	  }
	],
	links: [
	  [1, 2, 0, 5, 0, "IMAGE"], [2, 3, 0, 5, 1, "AUDIO"], [3, 4, 0, 5, 2, "MODEL"],
	  [4, 4, 1, 5, 3, "MODEL"], [5, 4, 2, 5, 4, "MODEL"], [6, 5, 0, 6, 0, "IMAGE"], [7, 5, 1, 6, 1, "AUDIO"]
	],
	groups: [
	  { title: "软件工作区", bounding: [107, 10, 1626, 1100], color: "#8A8", font_size: 24 },
	  { title: "流程信息区", bounding: [770, 706, 914, 388], color: "#b06634", font_size: 24 },
	  { title: "输入区", bounding: [124, 59, 634, 414], color: "#b06634", font_size: 24 },
	  { title: "输出区", bounding: [122, 485, 628, 616], color: "#b06634", font_size: 24 },
	  { title: "工作区", bounding: [770, 63, 923, 624], color: "#b06634", font_size: 24 }
	],
	config: {},
	extra: { ds: { scale: 0.8264462809917354, offset: [214.18273996128585, 6.318689708146906] } },
	version: 0.4
  };
  