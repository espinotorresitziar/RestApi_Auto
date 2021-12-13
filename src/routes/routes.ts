import {Request, Response, Router } from 'express'
import { Autos } from '../model/autos'
import { db } from '../database/database'

class DatoRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getAutos = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await Autos.find({})
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    private getMatricula = async (req: Request, res: Response) => {
        const {matricula} = req.params
        //console.log(req.params)
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query  = await Autos.find({
                "_matricula": matricula
            })
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })

        db.desconectarBD()
    }

    /*private getMatTip = async (req: Request, res: Response) => {
        //const valor = req.params.matricula
        const {matricula, tipo} = req.params
        console.log(req.params)
        res.send (`Me has dado la matricula ${matricula}, y es del tipo ${tipo}`)
        
    }*/

    private newAuto = async (req: Request, res: Response) => {
        const {_tipoObjeto, _precioBase, _potenciaMotor, _matricula} = req.body
        await db.conectarBD()
        const schema = {
            _tipoObjeto: _tipoObjeto,
            _precioBase: _precioBase,
            _potenciaMotor: _potenciaMotor,
            _matricula: _matricula
        }
        const nSchema = new Autos(schema)
        
        await nSchema.save()
            .then((doc:any) => {
                res.send(doc)
            })
            .catch((err: any) => {
                res.send(err)
            })    
        await db.desconectarBD()
    }

    //Put: solo responde cuando el cliente (postman) manda un metodo put.
    //Cambiar potencia de motor a un auto con matricula ""

    private updatePotencia = async (req: Request, res: Response) => {
        const {_matricula} = req.params
        const {_tipoObjeto, _precioBase, _potenciaMotor} = req.body
        await db.conectarBD()
        await Autos.findOneAndUpdate(
            {
                _matricula: _matricula,
            },
            {
                _tipoObjeto: _tipoObjeto,
                _precioBase: _precioBase,
                _potenciaMotor: _potenciaMotor,
                _matricula: _matricula
            }
        )
        .then((doc:any) => {
            res.send(doc)
        })
        .catch((err: any) => {
            res.send(err)
        })    
        await db.desconectarBD()
    }

    //Borrar por matricula

    

    misRutas(){
        this._router.get('/autos', this.getAutos)
        this._router.get('/autos/:matricula', this.getMatricula)
        //this._router.get('/autos/:matricula/:tipo', this.getMatTip)
        this._router.post('/newAuto', this.newAuto)
        this._router.put('/autos/:matricula', this.updatePotencia)
    }
}

const obj = new DatoRoutes()
obj.misRutas()
export const routes = obj.router
