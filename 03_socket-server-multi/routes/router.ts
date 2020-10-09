import { Router, Request, Response } from "express";
import Server from "../classes/server";
import { usuariosConectados } from "../sockets/sockets";
import { GraficaData } from "../classes/grafica";
import { EncuestaData } from "../classes/encuesta";

const router = Router();
const grafica = new GraficaData();
const encuesta = new EncuestaData();
const server = Server.instance;


router.get("/grafica", (req: Request, res: Response) => {
  res.json(grafica.getDataGrafica());
});

// Envía un mensaje a todos los usuario vi REST
router.post("/grafica", (req: Request, res: Response) => {
  const mes = req.body.mes;
  const unidades = Number(req.body.unidades);

  grafica.incrementarValor(mes, unidades);
  server.io.emit("cambio-grafica", grafica.getDataGrafica() );
  res.json(grafica.getDataGrafica());
});



router.get("/encuesta", (req: Request, res: Response) => {
  res.json(encuesta.getDataEncuesta());
});

// Envía un mensaje a todos los usuario vi REST
router.post("/encuesta", (req: Request, res: Response) => {
  const pregunta: number = req.body.pregunta;
  const unidades: number = Number(req.body.unidades);

  encuesta.incrementarValor(pregunta, unidades);
  server.io.emit("cambio-encuesta", encuesta.getDataEncuesta() );
  res.json(encuesta.getDataEncuesta());
});



// Envia un mensaje a un usuario en especifico via REST
router.post("/mensajes/:id", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;
  const id = req.params.id;

  const payload = { de, cuerpo };

  const server = Server.instance;
  server.io.in(id).emit("mensaje-privado", payload);

  res.json({
    ok: true,
    cuerpo,
    de,
    id,
  });
});

// Servicio para obtener todos los ID's de los usuarios
router.get("/usuarios", (req: Request, res: Response) => {
  const server = Server.instance;
  server.io.clients((err: any, clientes: string) => {
    if (err) {
      return res.json({
        ok: false,
        err,
      });
    }

    res.json({
      ok: true,
      clientes,
    });
  });
});

// Obtener usuarios y sus nombres
router.get("/usuarios/detalle", (req: Request, res: Response) => {
  const lista = usuariosConectados.getLista();

  res.json({
    ok: true,
    clientes: lista,
  });
});

export default router;
