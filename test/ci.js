#!/usr/bin/env node

const { spawn } = require('child_process')
const http = require('http')

process.env.CI = 'true'

async function test () {
  const serverLocation = require.resolve('./server')
  const server = spawn('node', [serverLocation], { stdio: 'inherit' })
  process.on('exit', () => server.kill('SIGTERM'))
  while (true) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3000/ping', res => {
          res.on('error', reject)
          if (res.statusCode > 299) {
            reject(new Error(res.statusCode))
          } else {
            resolve(res)
          }
        })
        req.on('error', reject)
      })
      break
    } catch {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  const chunk = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), 30000)
    const req = http.get(
      'http://localhost:3000/youtube.com/?v=s-mOy8VUEBk',
      res => {
        res.on('error', reject)
        if (res.statusCode > 299) {
          reject(new Error(res.statusCode))
        } else {
          res.once('data', chunk => {
            clearTimeout(timer)
            resolve(chunk)
          })
        }
      }
    )
    req.on('error', reject)
  })
  if (chunk.slice(0, 3).toString() === 'ID3') {
    console.log('ID3v2 container detected, test ok')
    process.exit(0)
  } else {
    console.log('invalid chunk non ID3v2 container detected')
    process.exit(1)
  }
}

test().catch(err => {
  console.error(err)
  process.exit(1)
})
