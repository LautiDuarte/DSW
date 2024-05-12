import http from 'node:http'
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const hostname = '127.0.0.1'
const port = 3000
const logFilePath = './requests.log'

const server = http.createServer(async (req, res) => {
  const url = req.url
  console.log(url)
  console.log(req.method)
  
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'text/plain')
    res.end("405 Method Not Allowed")
    return
  }

  if (url === "/favicon.ico") {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end("404 Not Found")
    return
  }

  const filePath = url === "/" || url === "/index" || url === "/index.html" ? "./index.html" : `.${url}`

  try {
    const data = await readFile(filePath, 'utf-8')
    res.statusCode = 200
    res.setHeader('Content-Type', getFileContentType(filePath))
    res.end(data, 'utf-8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain')
      res.end("404 Not Found")
    } else {
      res.statusCode = 500
      res.setHeader('Content-Type', 'text/plain')
      res.end("500 Internal Server Error")
    }
  }

  try {
    const logData = `${new Date().toISOString()} ${req.method} ${req.url}\n`
    await appendToLogFile(logData)
  } catch (error) {
    console.error("Error writing to log file:", error)
  }
})

server.listen({ port, hostname }, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})

function getFileContentType(filePath) {
  if (filePath.endsWith('.html')) {
    return 'text/html'
  } else {
    return 'text/plain'
  }
}

async function appendToLogFile(data) {
  if (!existsSync(logFilePath)) {
    throw new Error("Log file does not exist")
  }
  await writeFile(logFilePath, data, { flag: 'a' })
}


/* TAREA: Modificar el servidor actual con las siguientes condiciones:
 * responde solo GET (ultimo)
 * responder el archivo de la ruta y manejar errores
 * si es extension html responder con el content-type correcto sino text/plain
 * si no existe el archivo responder con 404 Not Found
 * generar un archivo requests.log donde se almacene la fecha y la ruta de la peticion (mostrar un error por consola si requests.log no existe)
 * evitar que se pueda hacer un request a requests.log
 * devolver status code adecuado SIEMPRE
 * si el path del request es / /index /index.html debe devolver index.html
 * opcional: devolver el favicon
 */
