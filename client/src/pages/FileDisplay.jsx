import React, { Component } from 'react'
import api from '../api'

import styled from 'styled-components'

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

class Video extends Component {
    constructor(props){
        super(props)

        this.state = {
            compiledFile: "",
        }
    }

    componentDidMount = async () => {
        await CreateFileArray(this.props.fileData, this.props.name).then(returnedFile => {
            this.setState({ compiledFile: returnedFile })
        })
    }

    render() {
        return  <div>
                    {<video width="100%" height="auto" controls>
                        <source src={this.state.compiledFile} type="video/mp4" />
                    </video>}
                    <br/>
                    <br/>
                    <br/>
                </div>
    }
}

class FileDisplay extends Component {
    constructor(props){
        super(props)

        this.state = {
            files: [],
            fileName: this.props.match.params.name,
            fileType: this.props.match.params.type,
        }
    }

    componentDidMount = async () => {
        await api.getAllFiles().then(files => {
            this.setState({
                files: files.data.data
            })
        })
    }

    render() {
        let showVideo = false
        
        if(this.state.files.length > 0){
            switch(this.state.fileType){
                case "mp4":
                    showVideo = true
                    break
    
                case "webm":
                    showVideo = true
                    break

                case "ogg":
                    showVideo = true
                    break
    
                default:
                    break
            }
        }
        
        return <Wrapper>
                    {showVideo && (
                        <Video 
                            fileData={this.state.files} 
                            name={this.state.fileName} 
                        />
                    )}
                </Wrapper>
    }
}

const CreateFileArray = (fileData, name) => new Promise((resolve, reject) => {
    let currentFiles = []

    for(let i = 0; i < fileData.length; i++){
        if(fileData[i].name === name){
            currentFiles.push(fileData[i])
        }
    }

    let finalFile = ""

    for(let i = 0; i < currentFiles.length; i++){
        finalFile += currentFiles[i].file
    }
    resolve(finalFile)
})

export default FileDisplay