import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { MemesList, MemesInsert, MemesUpdate, VideoDisplay } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App(){
  return(
    <Router>
        <NavBar />
        <Switch>
            <Route path="/" exact component={MemesList} />
            <Route path="/memes/list" exact component={MemesList}/>
            <Route path="/memes/create" exact component={MemesInsert}/>
            <Route path="/memes/update/:id" exact component={MemesUpdate}/>
            <Route path="/memes/video/:name" exact component={VideoDisplay}/>
        </Switch>
    </Router>
  )
}

export default App