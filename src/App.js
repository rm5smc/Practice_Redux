import React, { Component } from 'react';
import './App.css';
import TaskForm from './components/TaskForm';
import Control from './components/Control';
import TaskList from './components/TaskList';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            isDisplayForm: false,
            taskEditing:null,
            filter:{
                name: '',
                status: -1
            },
            keyword:''

        }
    }

    componentWillMount = () => {
        if(localStorage && localStorage.getItem('tasks')){
            var tasks = JSON.parse(localStorage.getItem('tasks'));
            this.setState({
                tasks : tasks
            });
        }
    }

    // onGenerateData = () => {
    //     var tasks = [
    //         {
    //             id:this.genegateID(),
    //             name:'Hoc lap trinh',
    //             status: true
    //         },
    //         {
    //             id:this.genegateID(),
    //             name:'Game',
    //             status: false
    //         },
    //         {
    //             id:this.genegateID(),
    //             name:'Ngu',
    //             status: true 
    //         }
    //     ];
    //     this.setState({
    //         task : tasks
    //     });
    //     localStorage.setItem('tasks',JSON.stringify(tasks));
    // }

    s4(){
        return Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
    }

     genegateID(){
         return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
     }

    onToggleForm = () => {  // Theem tassk
        if(this.state.isDisplayForm && this.state.taskEditing !== null){
            this.setState ({
                isDisplayForm : true,
                taskEditing: null
            });
        }else{
            this.setState ({
                isDisplayForm : !this.isDisplayForm,
                taskEditing: null
            });
        }
        
    }

    onCloseForm = () => {
        this.setState ({
            isDisplayForm : false
        });
    }

    onShowForm = () => {
        this.setState ({
            isDisplayForm : true
        });
    }

    onSubmit = (data) => {
        var {tasks} = this.state; // task = this.state.tasks
        if(data.id === ''){
            data.id = this.genegateID();  //data chinh la 1 cai task
            tasks.push(data);
        }else{
            //Editing
            var index = this.findIndex(data.id);
            tasks[index] = data;
        }
        
        this.setState({
            tasks : tasks, 
            taskEditing: null
        });
        localStorage.setItem('tasks',JSON.stringify(tasks));
    }

    onUpdateStatus = (id) => {
        var {tasks} = this.state;
        var index = this.findIndex(id);
        console.log(index);
        if(index !== -1){
            tasks[index].status = !tasks[index].status;
            this.setState({
                tasks : tasks
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }

    findIndex = (id) => {
        var {tasks} = this.state;
        var result = -1;
        tasks.forEach((task, index) => {
            if(task.id === id){
                result = index;
            }
        });
        return result; 
    }

    onDelete = (id) => {
        var {tasks} = this.state;
        var index = this.findIndex(id);
        if(index !== -1){
            tasks.splice(index,1);
            this.setState({
                tasks : tasks
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        this.onCloseForm();
    }   

    onUpdate = (id) => {
        var {tasks} = this.state;
        var index = this.findIndex(id);
        var taskEditing = tasks[index];
        this.setState({
            taskEditing : taskEditing
        });
        this.onShowForm();
    }

    onSearch = (keyword) => {
        this.setState({
            keyword: keyword 
        });
    }

    onFilter = (filterName, filterStatus) => {
        filterStatus = parseInt(filterStatus, 10);
        this.setState({
            filter:{
                name:filterName.toLowerCase(),
                status:filterStatus
            }
        });
    }

  render() {

    var {tasks,isDisplayForm,taskEditing,filter,keyword} = this.state;
    if(filter){
        if(filter.name){
            tasks = tasks.filter((task) => {
                return task.name.toLowerCase().indexOf(filter.name) !== -1;
            });
        }
        if(filter.status){
            tasks =tasks.filter((task) => {
                if(filter.status === -1){
                    return task;
                }else{
                    return task.status === (filter.status === 1 ? true : false)
                }
            });
        }
    }

    if(keyword){
        tasks = tasks.filter((task) => {
            return task.name.toLowerCase().indexOf(keyword) !== -1;
        });
    }
  
    var elmTaskForm = isDisplayForm 
            ? <TaskForm 
                        onSubmit={this.onSubmit} 
                        onCloseForm={this.onCloseForm} 
                        task={taskEditing}
                        /> : ''; 

    return (
    <div className="container">
        <div className="text-center">
            <h1>Quản Lý Công Việc</h1>
            <hr />
        </div>
        <div className="row">
            <div className={ isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''}>
                {/*Form */}
                    {elmTaskForm}
            </div>
            <div className={ isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12'}>
                <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={ this.onToggleForm}
                    >
                    <span className="fa fa-plus mr-5" />Thêm Công Việc
                </button>
                {/* <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={ this.onGenerateData}
                    >
                    <span/>Dữ liệu giả
                </button> */}

                {/*Search - Sort */}
                    <Control onSearch={this.onSearch} />
                {/*List */}
                    <TaskList 
                            tasks={tasks} 
                            onUpdateStatus={this.onUpdateStatus} 
                            onDelete={this.onDelete}
                            onUpdate={this.onUpdate}
                            onFilter={this.onFilter}
                            />
            </div>
        </div>
    </div>
    );
  }
}

export default App;
