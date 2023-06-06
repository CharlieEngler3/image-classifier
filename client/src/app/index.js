import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { ImagesList, ImagesInsert, ImagesUpdate, FileDisplay } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App(){
  return(
    <Router>
        <NavBar />
        <Switch>
            <Route path="/" exact component={ImagesList} />
            <Route path="/images/list" exact component={ImagesList}/>
            <Route path="/images/create" exact component={ImagesInsert}/>
            <Route path="/images/update/:id" exact component={ImagesUpdate}/>
            <Route path="/images/file/:name/:type" exact component={FileDisplay}/>
        </Switch>
    </Router>
  )
}

export default App