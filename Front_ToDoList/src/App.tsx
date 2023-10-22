import { useState , useEffect, useRef} from 'react'
import Item from '../src/Item/item'
import './App.css'
import axios, { all } from 'axios'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';

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
  const [titulo,setTitulo] = useState('')
  const [conteudo,setConteudo] = useState('')
  const [loadingSend,setLoadingSend] = useState(false)
  const toast = useRef<any>(null);
  


  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    if(user.userId === undefined) return
    getItens()
  }, [user])


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

  async function createItem() {
    setLoadingSend(true)
    if (titulo === '' ) {
      setLoadingSend(false)
      showWarn('Preencha o campo de titulo')
      return
    }
    axios.post(`http://localhost:5232/ToDoItem`,{
      name: titulo,
      content: conteudo,
      is_done: false,
      userId: user.userId,
      created_at: new Date(),
      updated_at: new Date()
    })
    .then((response) => {
      setItens([...itens,response.data])
      showSuccess('Item criado com sucesso')
      setConteudo('')
      setTitulo('')
      setLoadingSend(false)
    })
  }


  function findUser(id:number){
    const user = users.find((u) => u.userId === id)
    if(user === undefined) return
    setUser(user)
  }

  const showWarn = (mensagem: string) => {
    toast.current.show({severity:'warn', summary: 'Warning', detail:mensagem, life: 3000});
  }

  const showSuccess = (mensagem: string) => {
    toast.current.show({severity:'success', summary: 'Success', detail:mensagem, life: 3000});
  }


  return (
    <>
      <div  className='fundo'>

        <div className='logo'>
          <h1>ToDo List</h1>
        </div>

        <div className='barraFuncoes' >
          <Dropdown value={user.userId} onChange={e => findUser(Number(e.value))} options={users.map(user => ({name: user.name, value:user.userId}))} optionLabel="name" 
            placeholder="Select a City"/>
          <span className="p-float-label">
              <InputText id="Titulo" name='Titulo'onChange={
                (e) => {
                  setTitulo(e.target.value)
                }
              } value={titulo} tooltip="Insira o titulo do seu ToDo Item" tooltipOptions={{ position: 'right', mouseTrack: true }}/>
              <label htmlFor="Titulo">Titulo</label>
          </span>
          <Button label="Submit" icon="pi pi-check" loading={loadingSend} onClick={
            () => {
              createItem()
            }
          } />
        </div>

        <div className='inputConteudo' >

          <span className="p-float-label">
              <InputTextarea id="conteudo" rows={5} cols={65} onChange={
                (e) => {
                  setConteudo(e.target.value)
                }
              } value={conteudo} tooltip='Insira o conteudo do seu ToDo item' tooltipOptions={{ position: 'right', mouseTrack: true }}/>
              <label htmlFor="conteudo">conteudo</label>
              <Toast ref={toast} />
          </span>

        </div>
        


        <div className="espaçoItens" > 
          {loading ? <p>carregando</p>: itens.map((i) => (
            <Item key={i.toDoItemId} item={i}/>))
          }
        </div>

      </div>

    </>
  )
}

export default App
