import { Card } from 'primereact/card';
import './item.css'
import { RadioButton } from 'primereact/radiobutton';
import React, { useState,useRef } from "react";
import axios, { all } from 'axios'
import { Toast } from 'primereact/toast';


        
interface ToDoItem {
    toDoItemId: number
    name: string
    content: string
    is_done: boolean
    created_at: string
    updated_at: string
    userId: number
  }



export default function Item({item}:{item: ToDoItem}) {

    const showWarn = (mensagem: string) => {
        toast.current.show({severity:'error', summary: 'Error', detail:mensagem, life: 3000});
      }
    
      const showSuccess = (mensagem: string) => {
        toast.current.show({severity:'success', summary: 'Success', detail:mensagem, life: 3000});
      }
    
      const toast = useRef<any>(null);
    
    
    function formatarDataHoraParaBrasileiro(dataObj:Date) {
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); // Os meses começam em 0
        const ano = dataObj.getFullYear();
      
        const horas = String(dataObj.getHours()).padStart(2, '0');
        const minutos = String(dataObj.getMinutes()).padStart(2, '0');
        const segundos = String(dataObj.getSeconds()).padStart(2, '0');
      
        return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
      }
    
    const [isConcluido, setIsConcluido] = useState(item.is_done ? "1" : "0");

    async function updateItem(){
        const itemAtualizado = {
            ...item,
            updated_at : new Date(),
            is_done: isConcluido == "1" ? true : false
        }
        axios.put(`http://localhost:5232/ToDoItem/${item.toDoItemId}`,itemAtualizado)
        .then((response) => {
            showSuccess('Item atualizado com sucesso')
        
        })
        .catch((error) => {
            showWarn('Erro ao atualizar item')
        })
    }
            


    return <>
        <Card title={item.name} subTitle={formatarDataHoraParaBrasileiro(new Date(item.created_at))} className= "item" >
            <p>
                {item.content}
            </p>
            <div className='container'>
            <div className="flex align-items-center">
                <RadioButton inputId="feito" name="feito" value="1" onChange={() => {
                    setIsConcluido("1")
                    updateItem()
                }} checked = {isConcluido == "1"}/>
                <label htmlFor="feito" className="ml-2">Concluido</label>
            </div>
            <div className="flex align-items-center ">
                <RadioButton inputId="pendente" name="pendente" value="0" onChange={() => {
                    setIsConcluido("0")
                    updateItem()
                }} checked = {isConcluido == "0"}/>
                <label htmlFor="pendente" className="ml-2">Pendente</label>
                <Toast ref={toast} />
            </div>
            </div>
        </Card>
    </>

    
}