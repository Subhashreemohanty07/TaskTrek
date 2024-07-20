import './App.css';
import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa"; //for edit icon
import { MdDelete } from "react-icons/md"; //for delete icon
import { TiTick } from "react-icons/ti"; // for completed task icon

function App() {
  const [completeScreen,setcompleteScreen] = useState(false); //here the false means in the todoscreen and true means in completescreen
  const [allTask,setallTask]=useState([]); //for all task in a empty array
  const [addTitle,setaddTitle]=useState("");
  const [addDescription,setaddDescription]=useState("");

  //for edit task
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  //for completed task
  const[completedTask,setcompletedTask] = useState([])

  //for add task
  const handleAddTask = ()=>{
    //prevent from adding empty task or description
    if (addTitle.trim() === "" || addDescription.trim() === "") {
      return;
    }
    let newtaskItem ={
      title:addTitle,
      description:addDescription
    }
    let updatedTodoArr=[...allTask];
    updatedTodoArr.push (newtaskItem);
    setallTask(updatedTodoArr);
    //store the data in local storage
    localStorage.setItem('todolist',JSON.stringify(updatedTodoArr))
      // clear input fields
      setaddTitle("");
      setaddDescription("");
  };

  //for delete from all task
  const handleDeleteTask = (index)=>{
    let deletetodo=[...allTask];
    deletetodo.splice(index,1);
    
    localStorage.setItem('todolist',JSON.stringify(deletetodo));
    setallTask(deletetodo);
  }

  //for update task
  const handleEditTask = (index) => {
    setCurrentTaskIndex(index);
    setEditTitle(allTask[index].title);
    setEditDescription(allTask[index].description);
    setIsEditing(true);
  };

  const handleUpdateTask = () => {
    let updatedTasks = [...allTask];
    updatedTasks[currentTaskIndex] = {
      title: editTitle,
      description: editDescription
    };
    setallTask(updatedTasks);
    localStorage.setItem('todolist', JSON.stringify(updatedTasks));
    setIsEditing(false);
  };
  //end of update

  //for completed task
  const handleComplete=(index)=>{
    let now =new Date();
    let dd = now.getDate();
    let mm= now.getMonth();
    let yyyy=now.getFullYear();
    let h= now.getHours();
    let m= now.getMinutes();
    let s= now.getSeconds();
    let completedOn = dd + '-' + mm + '-' + yyyy + ' at ' + h + ':'+ m + ':' + s;
  
  let filterItem = {
    ...allTask[index],
    completedOn:completedOn
   
  }
let updatedCompletedArr=[...completedTask];
updatedCompletedArr.push(filterItem);
setcompletedTask(updatedCompletedArr);
handleDeleteTask(index);
localStorage.setItem('completedTask',JSON.stringify(updatedCompletedArr));
}
// delete from completed task
const handleDeleteCompletedTask = (index)=>{
  let deletetodo=[...completedTask];
  deletetodo.splice(index,1);
  
  localStorage.setItem('completedTask',JSON.stringify(deletetodo));
  setcompletedTask(deletetodo);
}

  useEffect(()=>{
    //to convert the local storage data into array use parse
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTask = JSON.parse(localStorage.getItem('completedTask'));

    if(savedTodo){
      setallTask(savedTodo);
    }
    if(savedCompletedTask){
      setcompletedTask(savedCompletedTask);
    }
  },[])
  return (
    <div className="App">
      <h1>TaskTrek</h1>
      <div className="todo-container">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input type="text" 
            placeholder="What's the task title?"
              value={addTitle}
              onChange={(e)=>setaddTitle(e.target.value)}>
            </input>
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input type="text"
             placeholder="What's the task description?"
             value={addDescription}
             onChange={(e)=>setaddDescription(e.target.value)}
            ></input>
          </div>
          <div className="todo-input-item">
            <button type="button" onClick ={handleAddTask} className="btn">ADD</button>
          </div>
        </div>

        {/* Button for all tasks and completed tasks */}
        <div className="btnArea">
          <button className={`btn1 ${completeScreen === false && 'active'}`} onClick={() => setcompleteScreen(false)}>All</button>
          <button className={`btn1 ${completeScreen === true && 'active'}`} onClick={() => setcompleteScreen(true)}>Complete</button>
        </div>

        <div className="todo-list">
         {completeScreen===false && allTask.map((item,index)=>{
          return(
            <div className="todo-list-item" key={index}>
            <div className="task-info">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <div className='icon'>
              <FaEdit className="edit-icon" onClick={() => handleEditTask(index)} title='Edit'/>
              <MdDelete className="delete-icon" onClick={()=>handleDeleteTask(index)} title='delete'/>
              <TiTick className="complete-icon" onClick={()=>handleComplete(index)} title='completed' />
            </div>
          </div>
          )  
        }
        )    
         }

         {/* for completed btn */}
         {completeScreen===true && completedTask.map((item,index)=>{
          return(
            <div className="todo-list-item" key={index}>
            <div className="task-info">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="complete-time"><small>Task Completed On :{item.completedOn}</small></p>
            </div>
            <div className='icon'>
              <MdDelete className="delete-icon" onClick={()=>handleDeleteCompletedTask(index)} title='delete'/>
            </div>
          </div>
          )  
        }
        )    
         }
        </div>
      </div>
      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <div className="todo-input-item">
              <label>Title</label>
              <input type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}>
              </input>
            </div>
            <div className="todo-input-item">
              <label>Description</label>
              <input type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              ></input>
            </div>
            <button type="button" onClick={handleUpdateTask} className="btn">Update</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn cancel-btn">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
