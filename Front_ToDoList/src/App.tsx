import { useState , useEffect} from 'react'
import Item from '../src/Item/item'
import './App.css'
import axios from 'axios'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
        

interface ToDoItem {
  toDoItemId: number
  name: string
  content: string
  is_done: boolean
  created_at: string
  updated_at: string
  userId: number
}


interface User{

  userId:number
  name:string
  email:string
  password:string
  created_at:string
  updated_at:string
  todo_items:ToDoItem[]
}

function App() {
  const [itens, setItens] = useState<ToDoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user,setUser] = useState<User>({} as User)
  const [users,setUsers] = useState<User[]>([])

  useEffect(() => {
    getUsers()
  }, [])

  async function getUsers() {
    axios.get('http://localhost:5232/User')
    .then((response) => {
      setUsers(response.data)
      setUser(response.data[0])
    })
  }

  async function getItens() {
    axios.get(`http://localhost:5232/ToDoItem/usuario/${user.userId}`)
    .then((response) => {
      setItens(response.data)
      setLoading(false)
    })
  }

  useEffect(() => {
    if(user.userId === undefined) return
    getItens()
  }, [user])


  function findUser(id:number){
    const user = users.find((u) => u.userId === id)
    if(user === undefined) return
    setUser(user)
  }

  return (
    <>
      <div >

        <div className='logo'>
          <h1>ToDo List</h1>
        </div>

        <div className='barraFuncoes' >
          <Dropdown value={user.userId} onChange={e => findUser(Number(e.value))} options={users.map(user => ({name: user.name, value:user.userId}))} optionLabel="name" 
            placeholder="Select a City"/>

          <InputText/>

          
          <Button label="Submit" />
        </div>

        <div > 
          {loading ? <p>carregando</p>: itens.map((i) => (
            <Item key={i.toDoItemId} nome={`Item ${i.name}`} />))
          }
        </div>

      </div>

    </>
  )
}

export default App
