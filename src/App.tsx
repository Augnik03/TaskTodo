import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { CalendarIcon, Grid3X3Icon, ListIcon } from 'lucide-react'

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Not Started' | 'In Progress' | 'Completed';
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    id: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Not Started',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = () => {
    if (newTask.title && newTask.dueDate) {
      setTasks((prev) => [...prev, { ...newTask, id: uuidv4() }]);
      setNewTask({
        id: '',
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'Not Started',
      });
    }
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  return (
    <div className="container mx-auto p-4 font-poppins">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className='font-poppins'>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                placeholder="Enter task title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" value={newTask.priority} onValueChange={handleSelectChange("priority")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={addTask}>Add Task</Button>
        </CardFooter>
      </Card>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'grid')}>
        <TabsList>
          <TabsTrigger value="list"><ListIcon className="mr-2" />List View</TabsTrigger>
          <TabsTrigger value="grid"><Grid3X3Icon className="mr-2" />Grid View</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const statusColors = {
    'Not Started': 'bg-gray-200',
    'In Progress': 'bg-blue-200',
    'Completed': 'bg-green-200',
  };

  const priorityColors = {
    'Low': 'bg-yellow-200',
    'Medium': 'bg-orange-200',
    'High': 'bg-red-200',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? <Input name="title" value={editedTask.title} onChange={handleInputChange} /> : task.title}</CardTitle>
        <CardDescription>
          <CalendarIcon className="inline-block mr-1" />
          {isEditing ? <Input type="date" name="dueDate" value={editedTask.dueDate} onChange={handleInputChange} /> : task.dueDate}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Input name="description" value={editedTask.description} onChange={handleInputChange} />
        ) : (
          <p>{task.description}</p>
        )}
        <div className="mt-2">
          <span className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${priorityColors[task.priority]}`}>
            {isEditing ? (
              <Select name="priority" value={editedTask.priority} onValueChange={handleSelectChange("priority")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              task.priority
            )}
          </span>
          <span className={`inline-block px-2 py-1 rounded-full text-xs ${statusColors[task.status]}`}>
            {isEditing ? (
              <Select name="status" value={editedTask.status} onValueChange={handleSelectChange("status")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              task.status
            )}
          </span>
        </div>
      </CardContent>
      <CardFooter className="justify-end space-x-2">
        {isEditing ? (
          <Button onClick={handleSave}>Save</Button>
        ) : (
          <Button onClick={handleEdit}>Edit</Button>
        )}
        <Button variant="destructive" onClick={() => onDelete(task.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default App;