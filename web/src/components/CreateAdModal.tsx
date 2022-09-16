import { FormEvent, useEffect, useState } from 'react';
import { Check, GameController, Selection, CaretDown, CaretUp } from 'phosphor-react';

import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as ToggleGroup from '@radix-ui/react-toggle-group';

import { Input } from './Forms/Input';

import axios from 'axios';


interface Game {
    id: number;
    name: string;
  }

export function CreateAdModal() {

    const [ games, setGames ] = useState<Game[]>([]);
    const [ weekDays, setWeekDays ] = useState<string[]>([]);
    const [ useVoiceChat, setUseVoiceChat ] = useState(false);

    useEffect(() => {
        axios('http://localhost:3000/games').then(response => {
            setGames(response.data)
        })
    }, [])


    async function handleCreateAd(event: FormEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const data = Object.fromEntries(formData)

        if(!data.name){
            return;
        }

        try{
            await axios.post(`http://localhost:3000/games/${data.game}/ads`, {
                name: data.name,
                yearsPlaying: Number(data.yearsPlaying),
                discord: data.discord,
                weekDays: weekDays.map(Number),
                hourStart: data.hourStart,
                hourEnd: data.hourEnd,
                useVoiceChannel: useVoiceChat
            })
            alert('Anúncio criado com sucesso!')
        } catch (error) {
            console.log(error)
            alert('Erro ao criar anúncio!')
        }
    }
    
    return(
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40" /> {/* Fundo */}
          
          <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/50"> {/* Box */}
            
            <Dialog.Title className="text-3xl font-black">Criar Anúncio</Dialog.Title>
            
            <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="game" className="font-semibold">
                    Qual o Game?
                    </label>
                    <select 
                        id="game" 
                        name="game"
                        defaultValue=""
                        className='bg-zinc-900 rounded px-4 py-3 text-sm placeholder-zinc-500 appearance-none'
                    >
                        <option disabled value="">Selecione o game que deseja jogar!</option>

                        { games.map(game => {
                            return <option key={game.id} value={game.id}>{game.name}</option> }) }
                    </select>
                </div>
                
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className=" text-sm font-bold mb-2">
                    Seu nome (ou nickname)?
                    </label>
                    <Input id="name" name="name" placeholder="NoobMaster69"/>
                </div>

                <div className='grid grid-cols-2 gap-6'>
                    <div className="flex flex-col gap-2">
                    <label htmlFor="yearsPlaying" className="text-sm font-bold mb-2">
                        Quanto Tempo de Jogo?
                    </label>
                    <Input id="yearsPlaying" name="yearsPlaying" placeholder="Tudo bem ser Noob!"/>
                    </div>

                    <div className="flex flex-col gap-2">
                    <label htmlFor="discord" className="text-sm font-bold mb-2">
                        Qual seu Discord?
                    </label>
                    <Input id="discord" name="discord" placeholder="Juninho#1234"/>
                    </div>
                </div>

                <div className='flex gap-6'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="weekDays" className="text-sm font-bold mb-2">
                            Quando costuma jogar?
                        </label>

                            <ToggleGroup.Root type='multiple' className='grid grid-cols-7 gap-2' value={weekDays} onValueChange={setWeekDays} >
                                <ToggleGroup.Item title='Domingo' value='0' className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-red-600' : 'bg-zinc-900'}`}>D</ToggleGroup.Item>

                                <ToggleGroup.Item title='Segunda' value='1' className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-red-600' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>

                                <ToggleGroup.Item title='Terça' value='2' className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-red-600' : 'bg-zinc-900'}`}>T</ToggleGroup.Item>

                                <ToggleGroup.Item title='Quarta' value='3' className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-red-600' : 'bg-zinc-900'}`}>Q</ToggleGroup.Item>

                                <ToggleGroup.Item title='Quinta' value='4' className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-red-600' : 'bg-zinc-900'}`}>Q</ToggleGroup.Item>

                                <ToggleGroup.Item title='Sexta' value='5' className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-red-600' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>

                                <ToggleGroup.Item title='Sábado' value='6' className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-red-600' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>
                            </ToggleGroup.Root>
                    </div>
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label htmlFor="hoursPerDay" className="text-sm font-bold mb-2">
                        Qual horário costuma jogar?
                    </label>
                    <div className='grid grid-cols-2 gap-2'>
                        <Input id="hourStart" name="hourStart" type="time" placeholder="De"/>
                        <Input id="hourEnd" name="hourEnd" type="time" placeholder="Até"/>
                    </div>
                </div>

                <label className='mt-2 flex items-center gap-2 text-sm'>
                    <Checkbox.Root 
                        checked={useVoiceChat}
                        onCheckedChange={(checked)=>{
                            if(checked === true){
                                setUseVoiceChat(true)
                            } else{
                                setUseVoiceChat(false)
                            }
                        }} 
                        className='w-6 h-6 p-1 rounded bg-zinc-900'
                    >
                        <Checkbox.Indicator >
                            <Check className='w-4 h-4 text-emerald-400' />
                        </Checkbox.Indicator>
                    </Checkbox.Root>
                    Costumo me conectar ao chat de voz
                </label>

                <footer className='mt-4 flex justify-end gap-4'>
                    <Dialog.Close
                    type='button'
                    className='bg-zinc-500 hover:bg-zinc-600 px-5 h-12 rounded-md font-semibold'
                    >
                    Cancelar
                    </Dialog.Close>

                    <button type='submit' className='bg-red-600 hover:bg-red-700 px-5 h-12 rounded-md font-semibold flex items-center gap-3'>
                    <GameController size={24}/>
                    Publicar
                    </button>
                </footer>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
    );
}