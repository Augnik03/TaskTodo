import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { CalendarIcon, Grid3X3Icon, ListIcon, PlusCircle, Search, Filter } from 'lucide-react';

interface PopoverProps{
  trigger: React.ReactNode;
  content: React.ReactNode;
}



// Popover component
const Popover:React.FC<PopoverProps> = ({ trigger, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Close the popover when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={popoverRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-white rounded-md shadow-lg w-64">
          <div className="p-4">{content}</div>
        </div>
      )}
    </div>
  );
};

interface CheckboxProps{
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}


// Checkbox component
const Checkbox:React.FC<CheckboxProps> = ({ id, checked, onCheckedChange, label }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
      />
      {label && (
        <label htmlFor={id} className="ml-2 block text-sm leading-5 text-gray-900">
          {label}
        </label>
      )}
    </div>
  );
};

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
  const [filters, setFilters] = useState({
    priority: [] as string[],
    status: [] as string[],
  });

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

  const handleFilterChange = (filterType: 'priority' | 'status', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const filteredTasks = tasks
    .filter((task) =>
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.priority.length === 0 || filters.priority.includes(task.priority)) &&
      (filters.status.length === 0 || filters.status.includes(task.status))
    )
    .sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      if (priorityOrder[a.priority as keyof typeof priorityOrder] !== priorityOrder[b.priority as keyof typeof priorityOrder]) {
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      }
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-gray-200 p-8">
      <div className="container mx-auto bg-white bg-opacity-95 rounded-3xl shadow-2xl p-8">
        <h1 className="text-5xl font-poppins font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-center">
          Tasky
        </h1>

        <Card className="mb-8 shadow-xl rounded-2xl overflow-hidden border-t-4 border-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <CardTitle className="text-3xl font-extrabold">Create New Task</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-lg font-semibold text-gray-700">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    className="rounded-lg border-2 border-purple-200 focus:border-purple-500 transition"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate" className="text-lg font-semibold text-gray-700">Due Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className="rounded-lg pl-10 border-2 border-purple-200 focus:border-purple-500 transition"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-lg font-semibold text-gray-700">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                  className="rounded-lg border-2 border-purple-200 focus:border-purple-500 transition"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="priority" className="text-lg font-semibold text-gray-700">Priority</Label>
                  <Select name="priority" value={newTask.priority} onValueChange={handleSelectChange("priority")}>
                    <SelectTrigger className="rounded-lg border-2 border-purple-200 focus:border-purple-500 transition">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status" className="text-lg font-semibold text-gray-700">Status</Label>
                  <Select name="status" value={newTask.status} onValueChange={handleSelectChange("status")}>
                    <SelectTrigger className="rounded-lg border-2 border-purple-200 focus:border-purple-500 transition">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-end p-4">
            <Button onClick={addTask} className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xl rounded-full px-8 py-3 hover:from-blue-600 hover:to-indigo-600 transition shadow-lg">
              <PlusCircle className="mr-2" /> Add Task
            </Button>
          </CardFooter>
        </Card>

        <div className="mb-6 flex items-center space-x-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-full pl-10 border-2 border-blue-200 focus:border-blue-500 transition shadow-md w-full"
            />
          </div>
          <Popover
            trigger={
              <Button className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition flex items-center">
                <Filter className="mr-2" /> Filters
              </Button>
            }
            content={
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Priority</h3>
                  <div className="space-y-2">
                    {['Low', 'Medium', 'High'].map((priority) => (
                      <Checkbox
                        key={priority}
                        id={`priority-${priority}`}
                        checked={filters.priority.includes(priority)}
                        onCheckedChange={() => handleFilterChange('priority', priority)}
                        label={priority}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <div className="space-y-2">
                    {['Not Started', 'In Progress', 'Completed'].map((status) => (
                      <Checkbox
                        key={status}
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
                        onCheckedChange={() => handleFilterChange('status', status)}
                        label={status}
                      />
                    ))}
                  </div>
                </div>
              </div>
            }
          />
        </div>

        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'grid')} className="mb-8">
          <TabsList className="flex justify-center space-x-4 bg-gray-100 p-2 rounded-full">
            <TabsTrigger value="list" className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full hover:bg-gray-50 transition shadow">
              <ListIcon className="mr-2" /> List View
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center space-x-2 bg-white px-6 py-3 rounded-full hover:bg-gray-50 transition shadow">
              <Grid3X3Icon className="mr-2" /> Grid View
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-6">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </TabsContent>
          <TabsContent value="grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const TaskItem: React.FC<{ task: Task; onUpdate: (task: Task) => void; onDelete: (id: string) => void }> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const saveChanges = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-indigo-100 text-indigo-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden border-l-4 border-blue-500 hover:shadow-xl transition" >
      <CardContent className="p-6" >
        {
          isEditing ? (
            <div className="space-y-4" >

              <Input
                name="title"
                value={editedTask.title}
                onChange={handleInputChange}
                className="rounded-lg border-2 border-purple-200 focus:border-purple-500 transition"
              />
              <Input
                name="description"
                value={editedTask.description}
                onChange={handleInputChange}
                className="rounded-lg border-2 border-purple-200 focus:border-purple-500 transition"
              />
              <Input
                name="dueDate"
                type="date"
                value={editedTask.dueDate}
                onChange={handleInputChange}
                className="rounded-lg border-2 border-purple-200 focus:border-purple-500 transition"
              />
              <Select name="priority" value={editedTask.priority} onValueChange={handleSelectChange('priority')}>
                <SelectTrigger className="rounded-lg border-2 border-purple-200 focus:border-purple-500 transition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <Select name="status" value={editedTask.status} onValueChange={handleSelectChange('status')}>
                <SelectTrigger className="rounded-lg border-2 border-purple-200 focus:border-purple-500 transition">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">{task.title
              } </h3>
              < p className="text-gray-600 mb-4" > {task.description} </p>
              < div className="flex items-center space-x-4 mb-4" >
                <CalendarIcon className="text-gray-400" />
                <span className="text-sm text-gray-500" > {task.dueDate} </span>
              </div>
              < div className="flex space-x-2" >
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                < span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`
                }>
                  {task.status}
                </span>
              </div>
            </div>
          )}
      </CardContent>
      < CardFooter className="flex justify-between" >
        {
          isEditing ? (
            <Button onClick={saveChanges} className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition" >
              Save
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition">
              Edit
            </Button>
          )}
        <Button onClick={() => onDelete(task.id)} className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition" >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

const TaskCard: React.FC<{ task: Task; onUpdate: (task: Task) => void; onDelete: (id: string) => void }> = ({ task, onUpdate, onDelete }) => {
  return (
    <TaskItem task={task} onUpdate={onUpdate} onDelete={onDelete} />
  );
};

export default App;