let globalVar = {};



function guid() {
	/*
	 * @method guid
	 * @return {String} 随机数值
	 * @for index.js
	 * @param 无
	 */
	return "xxx-xxx-xxx".replace(/[x]/g, function() {
		let x = Math.round(Math.random() * 16);
		return x.toString(16)
	})
}

function newNode(NodeX, NodeY, Name, Direct) {
	/*
	 * @method newNode
	 * @return {String} id
	 * @for index.js
	 * @param {int} NodeX X
	 * @param {int} NodeX 节点纵坐标
	 * @param {String} Name 节点内容
	 * @param {String} Direct 节点连接方向(可选)
	 */
	let newNodeAttr = {
		id: guid(),
		Name: Name + Direct,
		Attr: {
			selfX: NodeX,
			selfY: NodeY,
			selfRadiu: 50,
			ConnectNode: [{
					Direct: "top",
					selfX: NodeX,
					selfY: NodeY - 50,
					ConnectNodeId: "",
					ConnectNodeX: "",
					ConnectNodeY: ""
				},
				{
					Direct: "right",
					selfX: NodeX + 50,
					selfY: NodeY,
					ConnectNodeId: "",
					ConnectNodeX: "",
					ConnectNodeY: ""
				},
				{
					Direct: "bottom",
					selfX: NodeX,
					selfY: NodeY + 50,
					ConnectNodeId: "",
					ConnectNodeX: "",
					ConnectNodeY: ""
				},
				{
					Direct: "left",
					selfX: NodeX - 50,
					selfY: NodeY,
					ConnectNodeId: "",
					ConnectNodeX: "",
					ConnectNodeY: ""
				},
			]

		}
	}
	if (Direct) {
		newNodeAttr.Attr.ConnectNode[arguments[4]].ConnectNodeId = arguments[5];
		newNodeAttr.Attr.ConnectNode[arguments[4]].ConnectNodeX = arguments[6];
		newNodeAttr.Attr.ConnectNode[arguments[4]].ConnectNodeY = arguments[7];
	}
	globalVar.nodeArray.push(newNodeAttr);
	if (document.cookie != "") {
		DelCookie("a123")
	}
	let globalVarCookie = JSON.stringify(globalVar);
	setCookie("a123", globalVarCookie, 2);
	if (arguments[8]) {
		return newNodeAttr.id
	}


}

function ResetCanvas() {
	/*
	 * @method ResetCanvas
	 * @for index.js
	 */
	globalVar.mainPoint.beginPath();
	globalVar.mainPoint.clearRect(0, 0, globalVar.mainCanvas.clientWidth, globalVar.mainCanvas.clientHeight);
	printNode();
}

function printNode() {
	/*
	 * @method printNode
	 * @for index.js
	 */
	for (let LoopValueA = 0; LoopValueA < globalVar.nodeArray.length; LoopValueA++) {
		globalVar.mainPoint.beginPath();
		globalVar.mainPoint.lineWidth = 3;
		globalVar.mainPoint.arc(
			globalVar.nodeArray[LoopValueA].Attr.selfX,
			globalVar.nodeArray[LoopValueA].Attr.selfY,
			globalVar.nodeArray[LoopValueA].Attr.selfRadiu,
			0,
			2 * Math.PI,
			false);
		globalVar.mainPoint.stroke();
		for (let LoopValueB = 0; LoopValueB < globalVar.nodeArray[LoopValueA].Attr.ConnectNode.length; LoopValueB++) {
			if (globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].ConnectNodeId) {
				globalVar.mainPoint.beginPath();
				globalVar.mainPoint.lineWidth = 3;
				globalVar.mainPoint.moveTo(
					globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].selfX,
					globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].selfY
				);
				globalVar.mainPoint.lineTo(
					globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].ConnectNodeX,
					globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].ConnectNodeY
				)
				globalVar.mainPoint.stroke();
			}
		}
	}
}

function moveJudge(mouseX, mouseY) {
	for (let LoopValueA = 0; LoopValueA < globalVar.nodeArray.length; LoopValueA++) {
		globalVar.mainPoint.beginPath();
		globalVar.mainPoint.arc(
			globalVar.nodeArray[LoopValueA].Attr.selfX,
			globalVar.nodeArray[LoopValueA].Attr.selfY,
			globalVar.nodeArray[LoopValueA].Attr.selfRadiu,
			0,
			2 * Math.PI,
			false
		)
		if (globalVar.mainPoint.isPointInPath(mouseX, mouseY)) {
			globalVar.moveOnNode = LoopValueA;
			if (globalVar.moveOnNodeOld != null) {
				try {
					let a = document.getElementById("Delete-" + globalVar.nodeArray[globalVar.moveOnNodeOld].id),
						b = document.getElementById("Modify-" + globalVar.nodeArray[globalVar.moveOnNodeOld].id);
					a.parentNode.removeChild(a);
					b.parentNode.removeChild(b);
				} catch (e) {

				}

			}
			globalVar.moveOnNodeOld = LoopValueA;
			return true;
		}
	}
	return false;
}

function createCarton(x, y, lineStartX, lineStartY, Direction) {
	let times = 0,
		judge = [],
		carton = setInterval(function() {
			if (times++ > 48) {
				clearInterval(carton);
			}
			ResetCanvas();
			globalVar.mainPoint.beginPath();
			// globalVar.mainPoint.clearRect(0, 0, globalVar.mainCanvas.clientWidth, globalVar.mainCanvas.clientHeight);
			globalVar.mainPoint.arc(x, y, times, 0, 2 * Math.PI, false);
			globalVar.mainPoint.stroke();
			globalVar.mainPoint.moveTo(lineStartX, lineStartY);
			switch (Direction) {
				case 0:
					globalVar.mainPoint.lineTo(lineStartX, lineStartY - times);
					globalVar.mainPoint.stroke();
					break;
				case 1:
					globalVar.mainPoint.lineTo(lineStartX + times, lineStartY);
					globalVar.mainPoint.stroke();
					break;
				case 2:
					globalVar.mainPoint.lineTo(lineStartX, lineStartY + times);
					globalVar.mainPoint.stroke();
					break;
				case 3:
					globalVar.mainPoint.lineTo(lineStartX - times, lineStartY);
					globalVar.mainPoint.stroke();
					break;
			}

			judge.push(times);
		}, 5);

	console.log(judge)
}

function createNode(LoopValue) {
	document.onclick = function() {
		console.log("123456");
		let nodeId, l;
		switch (LoopValue) {
			case 2:
				if (globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeId) {
					break;
				}

				createCarton(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY + 150,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY + 50,
					2
				)

				nodeId = newNode(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY + 150,
					globalVar.nodeArray[globalVar.moveOnNode].Name,
					"bottom",
					0,
					globalVar.nodeArray[globalVar.moveOnNode].id,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY + 50,
					true
				)
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeId = nodeId;
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeX =
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX;
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeY =
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY + 100;

				ResetCanvas();
				document.onclick = "";
				break;
			case 3:
				if (globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeId) {
					break;
				}

				l = createCarton(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX - 150,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX - 50,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
					3
				)

				nodeId = newNode(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX - 150,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
					globalVar.nodeArray[globalVar.moveOnNode].Name,
					"Left",
					1,
					globalVar.nodeArray[globalVar.moveOnNode].id,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX - 50,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
					true
				)
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeId = nodeId;
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeX =
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX - 100;
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeY =
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY;
				ResetCanvas();
				document.onclick = "";
				break;
			case 0:
				if (globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeId) {
					break;
				}

				l = createCarton(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY - 150,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY - 50,
					0
				)
				console.log(l);

				nodeId = newNode(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY - 150,
					globalVar.nodeArray[globalVar.moveOnNode].Name,
					"top",
					2,
					globalVar.nodeArray[globalVar.moveOnNode].id,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY - 50,
					true
				)
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeId = nodeId;
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeX =
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX;
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeY =
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY - 100;
				ResetCanvas();
				document.onclick = "";
				break;
			case 1:
				if (globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeId) {
					break;
				}

				l = createCarton(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX + 150,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX + 50,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
					1
				)

				nodeId = newNode(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX + 150,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
					globalVar.nodeArray[globalVar.moveOnNode].Name,
					"Right",
					3,
					globalVar.nodeArray[globalVar.moveOnNode].id,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX + 50,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
					true
				)
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeId = nodeId;
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeX =
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX + 100;
				globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValue].ConnectNodeY =
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY;
				ResetCanvas();
				document.onclick = "";
				break;

		}

	}
}

function nodeMove() {
	document.onmousedown = function(f) {
		let g1 = f.clientX,
			g2 = f.clientY;
		let Judge = false;
		// document.onclick = "";
		document.onmousemove = function(e) {
			try {
				let a = document.getElementById("Delete-" + globalVar.nodeArray[globalVar.moveOnNode].id),
					b = document.getElementById("Modify-" + globalVar.nodeArray[globalVar.moveOnNode].id);
				a.parentNode.removeChild(a);
				b.parentNode.removeChild(b);
			} catch (e) {}
			Judge = true;
			let mouseX = e.clientX,
				mouseY = e.clientY;
			globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX = mouseX;
			globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY = mouseY;

			for (let LoopValueA = 0; LoopValueA < 4; LoopValueA++) {

				switch (LoopValueA) {
					case 0:
						globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].selfX = mouseX;
						globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].selfY = mouseY - 50;
						break;
					case 1:
						globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].selfX = mouseX + 50;
						globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].selfY = mouseY;
						break;
					case 2:
						globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].selfX = mouseX;
						globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].selfY = mouseY + 50;
						break;
					case 3:
						globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].selfX = mouseX - 50;
						globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].selfY = mouseY;
						break;
				}

				if (globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].ConnectNodeId) {
					for (let LoopValueB = 0; LoopValueB < globalVar.nodeArray.length; LoopValueB++) {
						for (let LoopValueC = 0; LoopValueC < 4; LoopValueC++) {
							if (globalVar.nodeArray[globalVar.moveOnNode].id ===
								globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueC].ConnectNodeId &&
								globalVar.nodeArray[LoopValueB].id ===
								globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].ConnectNodeId
							) {
								globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueC].ConnectNodeX =
									globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].selfX;
								globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueC].ConnectNodeY =
									globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].selfY;
							}
						}
					}
				}

			}
			ResetCanvas();
			printNode();

		}
		document.onmouseup = function() {
			if (Judge) {
				document.onclick = "";
			}
			Judge = false;
			document.onmousedown = "";
			document.onmousemove = "";
			ResetCanvas();
			printNode();
			document.onmouseup = "";
			mouseJudge();
		}

	}
}

function mouseJudge() {
	document.onmousemove = function(e) {
		let mouseX = e.clientX,
			mouseY = e.clientY;
		if (moveJudge(mouseX, mouseY)) {

			ResetCanvas();

			for (let LoopValueA = 0; LoopValueA < 4; LoopValueA++) {
				globalVar.mainPoint.beginPath();
				globalVar.mainPoint.moveTo(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY
				)
				let LoopValueOfAToAddOne = LoopValueA + 1;
				globalVar.mainPoint.arc(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfRadiu,
					(1.25 + (0.5 * LoopValueA)) * Math.PI,
					(1.25 + (0.5 * LoopValueOfAToAddOne)) * Math.PI,
					false
				)
				if (globalVar.mainPoint.isPointInPath(mouseX, mouseY)) {
					globalVar.mainPoint.fillStyle = "#00ff00";
					globalVar.mainPoint.fill();

					createNode(LoopValueA);

				} else if (globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].ConnectNodeId) {
					globalVar.mainPoint.fillStyle = "#00ff00";
					globalVar.mainPoint.fill();
				}

				globalVar.mainPoint.beginPath();
				globalVar.mainPoint.fillStyle = "#000";
				globalVar.mainPoint.moveTo(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY
				)
				globalVar.mainPoint.arc(
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
					globalVar.nodeArray[globalVar.moveOnNode].Attr.selfRadiu,
					(1.25 + (0.5 * LoopValueA)) * Math.PI,
					(1.25 + (0.5 * (LoopValueA + 1))) * Math.PI,
					false
				)

				globalVar.mainPoint.stroke();
				globalVar.mainPoint.font = "20px bold 微软雅黑";
				switch (LoopValueA) {
					case 0:
						globalVar.mainPoint.fillText(
							LoopValueA + 1,
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX - 5,
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY - 20
						)
						break;
					case 1:
						globalVar.mainPoint.fillText(
							LoopValueA + 1,
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX + 20,
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY + 5
						)
						break;
					case 2:
						globalVar.mainPoint.fillText(
							LoopValueA + 1,
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX - 5,
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY + 30
						)
						break;
					case 3:
						globalVar.mainPoint.fillText(
							LoopValueA + 1,
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX - 30,
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY + 5
						)
						break;
				}

			}

			/* let DeleteButton = $("button").css({
				'position': 'absolute',
				'left': globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX+60+'px',
				'top': globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY+'px',
			}).text("X");
			$("body").add(DeleteButton); */
			if (document.getElementById("Delete-" + globalVar.nodeArray[globalVar.moveOnNode].id) == null) {
				let DeleteButton = document.createElement("button"),
					DeleteButtonX = globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX + 60,
					DeleteButtonY = globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY - 10;
				DeleteButton.id = "Delete-" + globalVar.nodeArray[globalVar.moveOnNode].id;
				DeleteButton.style.cssText = "position:absolute;left:" + DeleteButtonX + "px;top:" + DeleteButtonY + "px";
				DeleteButton.textContent = "X";
				DeleteButton.onclick = deleteNode;
				document.body.appendChild(DeleteButton);
			}
			if (document.getElementById("Modify-" + globalVar.nodeArray[globalVar.moveOnNode].id) == null) {
				let ModifyButton = document.createElement("button");
				ModifyButtonX = globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX - 70,
					ModifyButtonY = globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY - 10;
				ModifyButton.id = "Modify-" + globalVar.nodeArray[globalVar.moveOnNode].id;
				ModifyButton.style.cssText = "position:absolute;left:" + ModifyButtonX + "px;top:" + ModifyButtonY + "px";
				ModifyButton.textContent = "E";
				ModifyButton.onclick = editor;
				document.body.appendChild(ModifyButton);
			}
			try {
				let remove = document.getElementById("DeleteConnect");
				remove.parentNode.removeChild(remove);
			} catch (e) {}

			nodeMove();
			connectNode();
		} else if (connectJudge(mouseX, mouseY)) {
			console.log(123);
		} else {
			document.onclick = "";
			document.onmousedown = "";
			document.onmouseup = "";
			ResetCanvas();
		}
	}
}

function connectNode() {
	let StartDirectLen;
	document.onkeydown = function(e) {
		let Shift = e.keyCode,
			LoopValueToJudge,
			StartNodeLen = globalVar.moveOnNode;
		// document.onkeyup = function(){
		// 	ResetCanvas();
		// 	mouseJudge();
		// }
		// document.onmousemove = "";
		// console.log("456");
		if (Shift === 16) {


			// if(document.onmousemove != nodeAreaMove){
			// 	
			// }
			document.onmousedown = function(l) {
				document.onmousedown = "";
				console.log("123");
				let JudgeX = l.clientX,
					JudgeY = l.clientY;
				ResetCanvas();
				printNode();
				for (let LoopValueA = 0; LoopValueA < 4; LoopValueA++) {
					let LoopValueOfAToAddOne = LoopValueA + 1;
					globalVar.mainPoint.beginPath();
					globalVar.mainPoint.moveTo(
						globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
						globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY
					);
					globalVar.mainPoint.arc(
						globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
						globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
						globalVar.nodeArray[globalVar.moveOnNode].Attr.selfRadiu,
						(1.25 + (0.5 * LoopValueA)) * Math.PI,
						(1.25 + (0.5 * LoopValueOfAToAddOne)) * Math.PI,
						false
					);
					if (globalVar.mainPoint.isPointInPath(JudgeX, JudgeY) &&
						globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].ConnectNodeId == ""
					) {

						LoopValueToJudge = LoopValueA;

					} else {
						document.onclick = "";
						document.onmousedown = "";
						document.onmouseup = "";
						ResetCanvas();
						mouseJudge();
					}
				}

				if (LoopValueToJudge != null) {


					document.onmousemove = function(k) {
						if (!StartDirectLen) {
							StartDirectLen = LoopValueToJudge
						}
						// console.log("456");
						ResetCanvas();
						printNode();
						let mouseX = k.clientX,
							mouseY = k.clientY;
						globalVar.mainPoint.beginPath();
						globalVar.mainPoint.fillStyle = "#000";
						globalVar.mainPoint.moveTo(
							mouseX,
							mouseY
						)
						globalVar.mainPoint.arc(
							mouseX,
							mouseY,
							50,
							(1.25 + (0.5 * LoopValueToJudge)) * Math.PI,
							(1.25 + (0.5 * (LoopValueToJudge + 1))) * Math.PI,
							false
						)
						globalVar.mainPoint.closePath();
						globalVar.mainPoint.stroke();
						globalVar.mainPoint.font = "20px bold 微软雅黑";
						switch (LoopValueToJudge) {
							case 0:
								globalVar.mainPoint.fillText(
									LoopValueToJudge + 1,
									mouseX - 5,
									mouseY - 20
								)
								break;
							case 1:
								globalVar.mainPoint.fillText(
									LoopValueToJudge + 1,
									mouseX + 20,
									mouseY + 5
								)
								break;
							case 2:
								globalVar.mainPoint.fillText(
									LoopValueToJudge + 1,
									mouseX - 5,
									mouseY + 30
								)
								break;
							case 3:
								globalVar.mainPoint.fillText(
									LoopValueToJudge + 1,
									mouseX - 30,
									mouseY + 5
								)
								break;
						}
					};

				}

			}
			document.onmouseup = "";
			document.onmouseup = function(e) {
				let mouseX = e.clientX,
					mouseY = e.clientY;
				document.onclick = "";
				document.onmousedown = "";

				if (moveJudge(mouseX, mouseY) &&
					globalVar.nodeArray[globalVar.moveOnNode].id != globalVar.nodeArray[StartNodeLen].id) {
					for (let LoopValueC = 0; LoopValueC < 4; LoopValueC++) {
						if (globalVar.nodeArray[globalVar.moveOnNode].id == globalVar.nodeArray[StartNodeLen].Attr.ConnectNode[
								LoopValueC].ConnectNodeId) {
							ResetCanvas();
							mouseJudge();
							document.onmouseup = "";
							return;
						}
					}
					for (let LoopValueB = 0; LoopValueB < 4; LoopValueB++) {
						globalVar.mainPoint.beginPath();
						globalVar.mainPoint.moveTo(
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY
						)
						let LoopValueOfAToAddOne = LoopValueB + 1;
						globalVar.mainPoint.arc(
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfX,
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfY,
							globalVar.nodeArray[globalVar.moveOnNode].Attr.selfRadiu,
							(1.25 + (0.5 * LoopValueB)) * Math.PI,
							(1.25 + (0.5 * LoopValueOfAToAddOne)) * Math.PI,
							false
						)
						if (globalVar.mainPoint.isPointInPath(mouseX, mouseY)) {
							globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueB].ConnectNodeId =
								globalVar.nodeArray[StartNodeLen].id;
							globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueB].ConnectNodeX =
								globalVar.nodeArray[StartNodeLen].Attr.ConnectNode[StartDirectLen].selfX;
							globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueB].ConnectNodeY =
								globalVar.nodeArray[StartNodeLen].Attr.ConnectNode[StartDirectLen].selfY;

							globalVar.nodeArray[StartNodeLen].Attr.ConnectNode[StartDirectLen].ConnectNodeId =
								globalVar.nodeArray[globalVar.moveOnNode].id;
							globalVar.nodeArray[StartNodeLen].Attr.ConnectNode[StartDirectLen].ConnectNodeX =
								globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueB].selfX;
							globalVar.nodeArray[StartNodeLen].Attr.ConnectNode[StartDirectLen].ConnectNodeY =
								globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueB].selfY;
						}
						// globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueB]
					}
				}
				ResetCanvas();
				mouseJudge();
				document.onmouseup = "";

			}
		}
		if (Shift == 46 || Shift == 8) {
			try {
				let a = document.getElementById("Delete-" + globalVar.nodeArray[globalVar.moveOnNode].id),
					b = document.getElementById("Modify-" + globalVar.nodeArray[globalVar.moveOnNode].id);
				a.parentNode.removeChild(a);
				b.parentNode.removeChild(b);
			} catch (e) {}
			deleteNode();
			document.onmouseup = "";
			document.onclick = "";
			document.onmousedown = "";
			document.onmousemove = "";
			ResetCanvas();
			mouseJudge();

		}
	}
}

function deleteNode() {
	// globalVar.nodeArray[globalVar.moveOnNode]
	try {
		let a = document.getElementById("Delete-" + globalVar.nodeArray[globalVar.moveOnNode].id),
			b = document.getElementById("Modify-" + globalVar.nodeArray[globalVar.moveOnNode].id);
		a.parentNode.removeChild(a);
		b.parentNode.removeChild(b);
	} catch (e) {}
	for (let LoopValueA = 0; LoopValueA < 4; LoopValueA++) {
		if (globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].ConnectNodeId != null) {
			for (let LoopValueB = 0; LoopValueB < globalVar.nodeArray.length; LoopValueB++) {
				if (globalVar.nodeArray[LoopValueB].id ==
					globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].ConnectNodeId
				) {
					for (let LoopValueC = 0; LoopValueC < 4; LoopValueC++) {
						if (globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueC].ConnectNodeId ==
							globalVar.nodeArray[globalVar.moveOnNode].id
						) {
							globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueC].ConnectNodeId = "";
							globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueC].ConnectNodeX = "";
							globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueC].ConnectNodeY = "";
						}
					}
				}
			}
		}
	}
	globalVar.nodeArray.splice(globalVar.moveOnNode, 1);
	document.onclick = "";
	// globalVar.moveOnNode = 0;
	printNode();
	// mouseJudge();
}

function modifyNode() {
	$("#faceNodeRelation").css({
		"top": ((window.innerHeight - 4) / 2) - 250 + "px",
		"display": "block"
	})
}

function changeMode() {
	if (globalVar.changeJudge) {
		globalVar.mainPoint.beginPath();
		globalVar.mainPoint.clearRect(0, 0, globalVar.mainCanvas.clientWidth, globalVar.mainCanvas.clientHeight);
		document.onmousemove = "";
		document.onclick = "";

		try {
			let a = document.getElementById("Delete-" + globalVar.nodeArray[globalVar.moveOnNode].id),
				b = document.getElementById("Modify-" + globalVar.nodeArray[globalVar.moveOnNode].id);
			a.parentNode.removeChild(a);
			b.parentNode.removeChild(b);
		} catch (e) {}

		$("#modifyButton").text("Design mode");
		globalVar.changeJudge = false;
		$("#faceNodeRelation").css({
			"left": (document.body.clientWidth / 2) - 350 + "px",
			"top": ((window.innerHeight - 4) / 2) - 250 + "px",
			"display": "block"
		})
		$("<div>").attr("id", "faceNodeButtonGroup").css({
			"height": "150px",
			"width": "700px",
		}).appendTo("#faceNodeRelation");
		changeNodeButton(0);

	} else {
		$("#modifyButton").text("Presentation mode");
		globalVar.changeJudge = true;
		document.getElementById("faceNodeButtonGroup").innerHTML = "";
		$("#faceNodeRelation").css("display", "none");
		mouseJudge();
		nodecarton();
	}
}

function changeNodeButton(LoopValue) {
	let faceNodeArray = [];
	$("#nodeName").val(globalVar.nodeArray[LoopValue].Name);
	for (let LoopValueA = 0; LoopValueA < 4; LoopValueA++) {
		if (globalVar.nodeArray[LoopValue].Attr.ConnectNode[LoopValueA].ConnectNodeId != "") {
			faceNodeArray.push(globalVar.nodeArray[LoopValue].Attr.ConnectNode[LoopValueA].ConnectNodeId);
		}
	}
	let NodeName, NodeLen;

	function faceChange(obj, Len) {
		document.getElementById(obj).onclick = function() {
			document.getElementById("faceNodeButtonGroup").innerHTML = "";
			changeNodeButton(Len);
		}
	}

	function faceChangeOfkey(obj, Len, select) {
		document.onkeydown = "";
		document.onkeydown = function(e) {
			if (e.keyCode == select) {
				document.getElementById("faceNodeButtonGroup").innerHTML = "";
				changeNodeButton(Len);
			}
		}
	}
	switch (faceNodeArray.length) {
		case 0:
			return;
			break;
		case 1:
			for (let LoopValueB = 0; LoopValueB < globalVar.nodeArray.length; LoopValueB++) {
				if (globalVar.nodeArray[LoopValueB].id == faceNodeArray[0]) {
					NodeName = globalVar.nodeArray[LoopValueB].Name
					NodeLen = LoopValueB;
				}
			}
			$("<button>").attr("id", faceNodeArray[0]).css({
				"width": "700px",
				"height": "140px",
			}).text(NodeName).appendTo("#faceNodeButtonGroup")
			faceChange(faceNodeArray[0], NodeLen);
			faceChangeOfkey(faceNodeArray[0], NodeLen,49);
			break;
		case 2:
			for (let LoopValueB = 0; LoopValueB < faceNodeArray.length; LoopValueB++) {
				for (let LoopValueC = 0; LoopValueC < globalVar.nodeArray.length; LoopValueC++) {
					if (globalVar.nodeArray[LoopValueC].id == faceNodeArray[LoopValueB]) {
						NodeName = globalVar.nodeArray[LoopValueC].Name
						NodeLen = LoopValueC;
					}
				}
				$("<button>").attr("id", faceNodeArray[LoopValueB]).css({
					"width": "350px",
					"float": "left",
					"height": "140px",
				}).text(NodeName).appendTo("#faceNodeButtonGroup")
				faceChange(faceNodeArray[LoopValueB], NodeLen);
				faceChangeOfkey(faceNodeArray[LoopValueB], NodeLen,49+LoopValueB);
			}
			break;
		case 3:

			for (let LoopValueB = 0; LoopValueB < faceNodeArray.length; LoopValueB++) {
				for (let LoopValueC = 0; LoopValueC < globalVar.nodeArray.length; LoopValueC++) {
					if (globalVar.nodeArray[LoopValueC].id == faceNodeArray[LoopValueB]) {
						NodeName = globalVar.nodeArray[LoopValueC].Name
						NodeLen = LoopValueC;

					}
				}
				$("<button>").attr("id", faceNodeArray[LoopValueB]).css({
					"width": "233px",
					"float": "left",
					"height": "140px",
				}).text(NodeName).appendTo("#faceNodeButtonGroup");
				faceChange(faceNodeArray[LoopValueB], NodeLen);
				faceChangeOfkey(faceNodeArray[LoopValueB], NodeLen,49+LoopValueB);
			}
			break;
		case 4:
			for (let LoopValueB = 0; LoopValueB < faceNodeArray.length; LoopValueB++) {
				for (let LoopValueC = 0; LoopValueC < globalVar.nodeArray.length; LoopValueC++) {
					if (globalVar.nodeArray[LoopValueC].id == faceNodeArray[LoopValueB]) {
						NodeName = globalVar.nodeArray[LoopValueC].Name
						NodeLen = LoopValueC;
					}
				}
				$("<button>").attr("id", faceNodeArray[LoopValueB]).css({
					"width": "175px",
					"float": "left",
					"height": "140px",
				}).text(NodeName).appendTo("#faceNodeButtonGroup");
				faceChange(faceNodeArray[LoopValueB], NodeLen);
				faceChangeOfkey(faceNodeArray[LoopValueB], NodeLen,49+LoopValueB);
			}
			break;
	}
}


function nodecarton() {
	let LoopValue = 0,
		carton = setInterval(function() {
			if (LoopValue++ > 48) {
				clearInterval(carton);
			}
			globalVar.mainPoint.beginPath();
			globalVar.mainPoint.clearRect(0, 0, globalVar.mainCanvas.clientWidth, globalVar.mainCanvas.clientHeight);
			for (let LoopValueA = 0; LoopValueA < globalVar.nodeArray.length; LoopValueA++) {
				globalVar.mainPoint.beginPath();
				globalVar.mainPoint.lineWidth = 3;
				globalVar.mainPoint.arc(
					globalVar.nodeArray[LoopValueA].Attr.selfX,
					globalVar.nodeArray[LoopValueA].Attr.selfY,
					LoopValue,
					0,
					2 * Math.PI,
					false);
				globalVar.mainPoint.stroke();
				for (let LoopValueB = 0; LoopValueB < globalVar.nodeArray[LoopValueA].Attr.ConnectNode.length; LoopValueB++) {
					if (globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].ConnectNodeId) {
						globalVar.mainPoint.beginPath();
						globalVar.mainPoint.lineWidth = 3;
						globalVar.mainPoint.moveTo(
							globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].selfX,
							globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].selfY
						);
						globalVar.mainPoint.lineTo(
							globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].ConnectNodeX,
							globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].ConnectNodeY
						)
						globalVar.mainPoint.stroke();
					}
				}
			}
		}, 5)

}

function connectJudge(mouseX, mouseY) {
	let startX, startY, EndX, EndY, judge;
	for (let LoopValueB = 0; LoopValueB < globalVar.nodeArray.length; LoopValueB++) {
		for (let LoopValueA = 0; LoopValueA < 4; LoopValueA++) {
			if (globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueA].ConnectNodeId == "") {
				continue;
			}
			startX = globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueA].selfX;
			startY = globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueA].selfY;
			EndX = globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueA].ConnectNodeX;
			EndY = globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueA].ConnectNodeY;

			globalVar.mainPoint.beginPath();
			globalVar.mainPoint.moveTo(startX, startY);
			globalVar.mainPoint.lineTo(EndX, EndY);
			if (globalVar.mainPoint.isPointInStroke(mouseX, mouseY)) {
				document.onclick = function() {
					try {
						if (document.getElementById("DeleteConnect") != null) {
							let remove = document.getElementById("DeleteConnect");
							remove.parentNode.removeChild(remove);
						}
					} catch (e) {}
					let DeleteConnect = document.createElement("button");
					startId = globalVar.nodeArray[LoopValueB].id;
					EndId = globalVar.nodeArray[LoopValueB].Attr.ConnectNode[LoopValueA].ConnectNodeId;
					DeleteConnect.id = "DeleteConnect";
					DeleteConnect.style.position = "absolute";
					DeleteConnect.style.top = startY + ((EndY - startY) / 2) + "px";
					DeleteConnect.style.left = startX + ((EndX - startX) / 2) + "px";
					DeleteConnect.textContent = "X";
					DeleteConnect.onclick = function() {
						deleteConnectLine(startId, EndId)
					}
					document.body.appendChild(DeleteConnect);
				}
				return true;
			} else {

				document.onclick = function() {
					try {
						let remove = document.getElementById("DeleteConnect");
						remove.parentNode.removeChild(remove);
						document.onclick = "";
					} catch (e) {}
				};
			}

		}
	}
	return false;
}

function deleteConnectLine(ID, ConnectID) {
	let nodeIndexOne, nodeIndexTwo;
	for (let LoopValueA = 0; LoopValueA < globalVar.nodeArray.length; LoopValueA++) {
		if (
			globalVar.nodeArray[LoopValueA].id == ID ||
			globalVar.nodeArray[LoopValueA].id == ConnectID
		) {
			for (let LoopValueB = 0; LoopValueB < 4; LoopValueB++) {
				if (
					globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].ConnectNodeId == ID ||
					globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].ConnectNodeId == ConnectID
				) {
					globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].ConnectNodeId = "";
					globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].ConnectNodeX = "";
					globalVar.nodeArray[LoopValueA].Attr.ConnectNode[LoopValueB].ConnectNodeY = "";
					ResetCanvas();
					try {
						if (document.getElementById("DeleteConnect") != null) {
							let remove = document.getElementById("DeleteConnect");
							remove.parentNode.removeChild(remove);
						}
					} catch (e) {}
					document.onclick = "";
					mouseJudge();
				}
			}
		}
	}
}

function editor() {
	globalVar.editorJudge = false;
	let ID = "editorWindow",
		LoopValue = globalVar.moveOnNode;
	document.onclick = "";
	document.onmousemove = "";
	try {
		let a = document.getElementById("Delete-" + globalVar.nodeArray[globalVar.moveOnNode].id),
			b = document.getElementById("Modify-" + globalVar.nodeArray[globalVar.moveOnNode].id);
		a.parentNode.removeChild(a);
		b.parentNode.removeChild(b);
	} catch (e) {}
	globalVar.mainPoint.beginPath();
	globalVar.mainPoint.clearRect(0, 0, globalVar.mainCanvas.clientWidth, globalVar.mainCanvas.clientHeight);

	$("<div>").attr("id", ID).css({
		"left": (document.body.clientWidth / 2) - 500 + "px",
		"top": ((window.innerHeight - 4) / 2) - 500 + "px",
		"display": "block",
		"width": 1000,
		"height": 1000,
		"position": "absolute",
		"border": "1px solid #000"
	}).appendTo("body");
	$("<textarea>").attr("name", "editorNodeContext").appendTo("#" + ID);
	CKEDITOR.replace("editorNodeContext");
	CKEDITOR.instances.editorNodeContext.setData(globalVar.nodeArray[globalVar.moveOnNode].Name);
	// CKEDITOR.instances.editorNodeContext.document.change(function(){})
	$("<div>").attr("id", "editorNodeSelect").css({
		"box-sizing": "border-box",
		"width": 800 + "px",
		"height": 250 + "px",
		"display": "block",
		"border": "1px solid #000",
		"position": "absolute",
		"top": 500 + "px",
		"left": 100 + "px"
	}).appendTo("#" + ID);
	$("<a>").attr("id", globalVar.nodeArray[globalVar.moveOnNode].id).css({
		"width": 800 + "px",
		"height": 50 + "px",
		"display": "block",
		"border": "1px solid #000",
		"box-sizing": "border-box"
	}).text(globalVar.nodeArray[globalVar.moveOnNode].Name).click(
		function() {
			CKEDITOR.instances.editorNodeContext.setData(globalVar.nodeArray[globalVar.moveOnNode].Name);
			LoopValue = globalVar.moveOnNode;
		}
	).appendTo("#editorNodeSelect");
	for (let LoopValueA = 0; LoopValueA < 4; LoopValueA++) {
		let IdOfDirection = globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].ConnectNodeId;
		if (globalVar.nodeArray[globalVar.moveOnNode].Attr.ConnectNode[LoopValueA].ConnectNodeId != null) {
			for (let LoopValueB = 0; LoopValueB < globalVar.nodeArray.length; LoopValueB++) {
				if (
					globalVar.nodeArray[LoopValueB].id == IdOfDirection
				) {
					$("<a>").attr("id", globalVar.nodeArray[globalVar.moveOnNode].id).css({
						"width": 800 + "px",
						"height": 50 + "px",
						"display": "block",
						"border": "1px solid #000",
					}).text(globalVar.nodeArray[LoopValueB].Name).click(
						function() {
							CKEDITOR.instances.editorNodeContext.setData(globalVar.nodeArray[LoopValueB].Name);
							LoopValue = LoopValueB;
						}
					).appendTo("#editorNodeSelect");
				}
			}
		}
	}
	$("<button>").attr("id", ID + "submit").text("submit").click(function() {
		let editorNodeVal = CKEDITOR.instances.editorNodeContext.document.getBody().getText();
		globalVar.nodeArray[LoopValue].Name = editorNodeVal;
	}).css({
		"position": "absolute",
		"left": 430 + "px",
		"top": 950 + "px"
	}).appendTo("#" + ID)
	$("<button>").attr("id", ID + "-close").text("X").click(
		function() {

			$("#" + ID).remove();
			$("#" + ID + "-close").remove();
			try {
				let O = document.getElementsByClassName("cke")[0];
				O.parentNode.removeChild(O);
			} catch (e) {
				console.log(e)
			}
			nodecarton();
			mouseJudge();
		}
	).css({
		"position": "absolute",
		"left": 525 + "px",
		"top": 950 + "px"
	}).appendTo("#" + ID);

}

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function DelCookie(name) {
	var d = new Date();
	d.setTime(d.getTime() - 1);
	var expires = "expires=" + d.toUTCString();
	document.cookie = name + "=" + 0 + ";" + expires + ";path=/";
}

let init = function() {
	let theFirstfiugreX = parseInt(document.body.clientWidth / 2),
		theFirstfiugreY = parseInt((window.innerHeight - 1) / 2);




	if (document.cookie == "") {
		globalVar = {
			nodeArray: [],
			mainCanvas: document.getElementById("mainCanvas"),
			mainPoint: mainCanvas.getContext("2d"),
			moveOnNode: 0,
			judge: "",
			movingNode: [],
			changeJudge: true,
			moveOnNodeOld: 0,
			editorJudge: true,

		}
		let globalVarCookie = JSON.stringify(globalVar);
		setCookie("a123", globalVarCookie, 2);

	} else {
		let globalVarCookie = document.cookie.match("a123").input;
		globalVarCookie = globalVarCookie.slice(5);
		globalVarCookie = JSON.parse(globalVarCookie);
		globalVar = globalVarCookie
		globalVar.mainCanvas = document.getElementById("mainCanvas");
		globalVar.mainPoint = mainCanvas.getContext("2d");
	}
	if (globalVar.nodeArray.length == 0) {
		newNode(theFirstfiugreX, theFirstfiugreY, "Start", "");
	}
	nodecarton();
	mouseJudge();
}

function bodyone() {
	//document.body.textContent = document.body.clientWidth+"*"+window.innerHeight;
	document.getElementById("mainCanvas").width = document.body.clientWidth;
	document.getElementById("mainCanvas").height = window.innerHeight - 4;
}



$(window).resize(function() {
	if (globalVar.editorJudge || globalVar.changeJudge) {
		bodyone();
		printNode();
		mouseJudge();
	}
})

$(function() {
	bodyone();
	init();

});
