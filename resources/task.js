            var counter = 0;
			var done = 0;
			var requestedLink = "response.php";
			var jsonObj = null;
			var xmlhttp = null;
			var last_id = 0;
			
			function addTask(tag, event) {
				var _task = [];
				if (tag == 'input') {
					if (event.keyCode != 13) {
						return;
					}
				}
				var task = document.getElementById("task");
				if (task.value == null || task.value == "") {
					task.focus();
					return;
				}
				++counter;
				++last_id;//create new task id
				createTemplate(last_id,task.value);
				task.value = "";
				task.focus();
				updateCounter();
				_task.push({
					id  	: counter,
					text	: task.value,
					checked : "false"
				});
				requestAddTask(_task);
			}
			
			function requestAddTask(task) {
				var request = {
					url		:requestedLink,
					method	:"POST",
					query	:"do=addTask&task="+JSON.stringify(task),
					tag		:"add"
				};
				sendRequest(request);
			}
			
			function createTemplate(id,task,isChecked) {
				var list_task = document.getElementById("list_task");
				var main_div = document.createElement("DIV");
				main_div.setAttribute("id","main_div_"+id);
				main_div.className = " task_row_div ";
				if (id % 2 == 0) {
					main_div.className += "row_bg";
				}else {
					main_div.className += "row_bg_alt";
				}
				var div_chkbox_task = document.createElement("DIV");
				div_chkbox_task.setAttribute("id","div_"+id);
				
				var input_checkbox = document.createElement('INPUT');
				input_checkbox.type = "checkbox";
				input_checkbox.name = "cbox[]";
				input_checkbox.id = "cbox_"+id;
				input_checkbox.value = id;
				if (isChecked == "true") {
					input_checkbox.checked = true;
				}
				input_checkbox.addEventListener("change", function(){ updateTaskStatus(this); });
				
				var span_task = document.createElement("SPAN");
				span_task.setAttribute("id","span_"+id);
				span_task.name = "span_task[]";
				span_task.className = "row_text_normal";
				span_task.innerHTML = task;
				span_task.addEventListener("click", function(event){ editTask(this,event); });
				
				div_chkbox_task.appendChild(input_checkbox);
				div_chkbox_task.appendChild(span_task);
				
				var input_span = document.createElement('INPUT');
				input_span.type = "text";
				input_span.name = "input_"+id;
				input_span.id = "input_"+id;
				input_span.name = "input_span[]";
				input_span.addEventListener("keydown", function(event){ editTask(this,event); });
				//input_span.addEventListener("blur", function(event){ editTask(this,event); });
				input_span.style.display = "none";
				input_span.className = "input_span";
				
				main_div.appendChild(div_chkbox_task);
				main_div.appendChild(input_span);
				
				if (sortOrder == "DESC") {
					list_task.insertBefore(main_div, list_task.childNodes[0]);
				}else {
					list_task.appendChild(main_div_task);
				}
				if (isChecked == "true") {
					toggleStrike(input_checkbox);
				}else {
					updateCounter();
				}
			}
			
			function updateTaskStatus(elemObj) {
				var isChecked = elemObj.checked;
				toggleStrike(elemObj);
				var task = [];
				task.push({
					id : elemObj.value,
					checked : (isChecked == true) ? "true" : "false"
				});
				requestUpdateTask(task);
			}
			
			function markAllRead() {
				var elemObj;
				var task = [];
				var chkboxes = document.getElementsByName("cbox[]");
				for (var i=0; i<chkboxes.length; i++) {
					elemObj = chkboxes[i];
					if (elemObj.checked == true) {
						continue;
					}
					elemObj.checked = true;
					toggleStrike(elemObj);
					
					task.push({
						id : elemObj.value,
						checked : "true"
					});
				}
				if (task.length > 0) {
					requestUpdateTask(task);
				}
			}
			
			function requestUpdateTask(task) {
				var request = {
					url		:requestedLink,
					method	:"POST",
					query	:"do=updateTask&task="+JSON.stringify(task),
					tag		:"update"
				};
				sendRequest(request);
			}
			
			function getId(elemObj) {
				var elemId  = elemObj.id;
				var idArray = elemId.split("_");
				return idArray[1];
			}
			
			function toggleStrike(elemObj) {
				var spanObj	  = document.getElementById("span_"+getId(elemObj));
				var isChecked = elemObj.checked;
				if (isChecked == true) {
					spanObj.className = "row_text_strike";
					if (done < counter) {
						done++;
					}
				}else {
					spanObj.className = "row_text_normal";
					if (done > 0) {
						done--;
					}
				}
				updateCounter();
			}
			
			function updateCounter() {
				var counterObj = document.getElementById("left_counter");
				counterObj.innerHTML = (counter>done)? counter-done : 0;
			}
			
			function deleteTask(elemObj) {
				var _task = [];
				var elemId = getId(elemObj);
				var list_task = document.getElementById("list_task");
				var removeObj = document.getElementById("main_div_"+elemId);
				var cboxObj   = document.getElementById("cbox_"+elemId);
				var isChecked = cboxObj.checked;
				list_task.removeChild(removeObj);
				if (isChecked == true) {
					--done;
				}
				--counter;
				updateCounter();
				_task.push({
					id : cboxObj.value
				});
				refreshTaskRowBg();
				requestDeleteTask(_task);
			}
			
			function requestDeleteTask(task) {
				var request = {
					url		:requestedLink,
					method	:"POST",
					query	:"do=deleteTask&task="+JSON.stringify(task),
					tag		:"delete"
				};
				sendRequest(request);
			}
			
			function editTask(elemObj,event) {
				var _task = [];
				var elemType = elemObj.nodeName;
				var id = getId(elemObj);
				var inputObj = document.getElementById("input_"+id);
				var spanObj  = document.getElementById("span_"+id);
				var divObj  = document.getElementById("div_"+id);
				var cboxObj  = document.getElementById("cbox_"+id);
				if (elemType == "SPAN") {
					inputObj.value = elemObj.innerHTML;
					inputObj.style.display = "block";
					divObj.style.display = "none";					
				}else {
					if (event.keyCode != null) {
						if (event.keyCode != 13) {
							return;
						}
					}
					if (inputObj.value == "") {
						deleteTask(elemObj);
						return;
					}
					spanObj.innerHTML = inputObj.value;
					inputObj.style.display = "none";
					divObj.style.display = "block";
					_task.push({
						id   : cboxObj.value,
						text : inputObj.value
					});
					requestUpdateTask(_task);
				}
			}
			
			function getHttpObj() {
				if(window.XMLHttpRequest) {
					xmlhttp = new XMLHttpRequest();
				}else {
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				return xmlhttp;
			}
			
			function requestFecthTask() {
				var request = {
					url		:requestedLink,
					method	:"POST",
					query	:"do=fetchTask",
					tag		:"fetch"
				};
				sendRequest(request);
			}
			
			function displayTask() {
				last_id  = jsonObj["last_id"];
				var task = jsonObj["task"];
				counter  = task.length;
				for (var i=0; i<counter; i++) {
					createTemplate(task[i].id, task[i].text, task[i].checked);
				}
			}
			
			function refreshTaskRowBg() {
				var elemId;
				var main_div;
				var checkboxes = document.getElementsByName("cbox[]");
				for (var i=0; i<checkboxes.length; i++) {
					main_div = document.getElementById("main_div_"+getId(checkboxes[i]));
					main_div.className = " task_row_div ";
					if (i % 2 == 0) {
						main_div.className += "row_bg";
					}else {
						main_div.className += "row_bg_alt";
					}
				}
			}
			
			function sendRequest(request) {
				xmlhttp = getHttpObj();
				xmlhttp.onreadystatechange=function() {
				  if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					onSuccess(xmlhttp , request.tag);
				  }
				}
				xmlhttp.open(request.method,request.url,true);
				xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				xmlhttp.send(request.query);
			}
			
			function onSuccess(response, tag) {
				if (tag == "delete") {
					//alert(response.responseText);
				}else if (tag == "fetch") {
					jsonObj = JSON.parse(response.responseText);
					displayTask();
				}else if (tag == "update") {
					//code
				}else if (tag == "add") {
					//alert(response.responseText);
				}
			}
			
			requestFecthTask();	