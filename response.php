<?php
     if(isset($_POST) && $_POST != null) {
        $method = $_POST["do"];
        $task = isset($_POST["task"]) ? $_POST["task"] : null;
        if($method == "fetchTask") {
            fetchTask();
        }else if($method == "deleteTask") {
            deleteTask($task);
        }else if($method == "addTask") {
            addTask($task);
        }else if($method == "updateTask") {
            updateTask($task);
        }
    }
    
    function fetchTask() {
        //fetch task
        $task = array();
        $temp = array();
        //calling db api to fetch tasks...
        //creating dummy array data
        for($i=0; $i<5;$i++) {
            $temp[$i] = [
                "id"      => $i,
                "text"    => "This is task # ".$i,
                "checked" => "false"
            ];
        }
        $task = [
            "last_id" => getLastTaskId(),
            "task"    => $temp
        ];
        echo json_encode($task);        
    }
    
    function addTask($task) {
        //add task
        $temp = json_decode($task);
        foreach($temp as $arr) {
            //calling db api to add task...
            echo "Task # ".$arr->id." created with checked = ".$arr->checked;    
        }
    }
    
    function updateTask($task) {
        //update task
        $temp = json_decode($task);
        foreach($temp as $arr) {
            //calling db api to update task...
            echo "Task # ".$arr->id." updated successfully.";    
        }
    }
    
    function deleteTask($task) {
        //delete task
        $temp = json_decode($task);
        foreach($temp as $arr) {
            //calling db api to delete task...
            echo "Task # ".$arr->id." deleted successfully.";    
        }
    }
    
    function getLastTaskId() {
        //calling db api to get last task id....
        return 4;
    }
?>