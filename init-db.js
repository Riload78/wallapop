'use strict';

require('dotenv').config()

const readline = require('node:readline');
const connection = require('./lib/connectMongoose');

const { Agente, Usuario } = require('./models')

main().catch(err => console.log('Huno un error', err));

async function main() {

  // esperar a que se conecte ala BD
  await new Promise((resolve) => connection.once('open', resolve) )


  const borrar = await pregunta('Estas seguro que quieres borrar el contenido de esta BD? (no)')
  if (!borrar) {
    process.exit();
  }

  await initUsuarios();
  await initAgents();

  connection.close();

}

async function initAgents() {
  // borrar todos los agente
  const deleted = await Agente.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} agentes.`);

  const [admin, usuario] = await Promise.all([
    Usuario.findOne({ email: 'admin@example.com' }),
    Usuario.findOne({ email: 'usuario@example.com' })
  ])

  // crear agentes iniciales
  const inserted = await Agente.insertMany([
    { name: 'Smith', age: 34, owner: admin._id  },
    { name: 'Brown', age: 43, owner: admin._id },
    { name: 'Jones', age: 25, owner: usuario._id },
  ]);
  console.log(`Creados ${inserted.length} agentes.`);
}

async function initUsuarios() {
  // borrar todos los usuarios
  const deleted = await Usuario.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} usuarios.`)

  // crear usuarios iniciales
  const inserted = await Usuario.insertMany([
    { email: 'admin@example.com', password: await Usuario.hashPassword('1234') },
    { email: 'usuario@example.com', password: await Usuario.hashPassword('1234') }
  ])
  console.log(`Creados ${inserted.length} usuarios.`)
}

function pregunta(texto) {
  return new Promise((resolve, reject) => {
    // conectar readline con la consola
    const ifc = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    ifc.question(texto, respuesta => {
      ifc.close();
      resolve(respuesta.toLowerCase() === 'si');
    })
  });
}