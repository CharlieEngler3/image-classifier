import React, { Component } from 'react'
import api from '../api'

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin:0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className:'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

class MemesInsert extends Component{
    constructor(props){
        super(props)

        this.state = {
            name: '',
            lowerName: '',
            description: '',
            filename: '',
            image: '',
        }
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
        const lowerName = name.toLowerCase()
        this.setState({ lowerName })
    }

    handleChangeInputDescription = async event => {
        const description = event.target.value
        this.setState({ description })
    }
    
    handleChangeInputFile = async event => {
        const filename = event.target.value.substring(12, event.target.value.length)
        this.setState({ filename })

        let image = event.target.files[0]
        let tempFile = null

        const imageExtensions = ['.jpg', '.png', '.jpeg', '.gif']
        let isImage = false

        for(let i = 0; i < imageExtensions.length; i++){
            if(filename.includes(imageExtensions[i]))
                isImage = true
        }

        if(isImage){
            await encodeImageFileAsURL(image).then(response => {
                image = response
            })
        }
        else{
            image = 'Non Image Post'

            tempFile = event.target.files[0]
        }

        this.setState({ image, tempFile })
    }

    handleIncludeMeme = async () => {
        const { name, lowerName, description, filename, image, tempFile } = this.state
        const imagePayload = { name, lowerName, description, filename, image }
        
        await api.insertMeme(imagePayload).then(res => {
            window.alert(`Meme inserted successfully`)
            this.setState({
                name: '',
                lowerName: '',
                description: '',
                filename: '',
                image: '',
            })
        }).catch(error => {
            if (!error.response) {
                console.log('Error: Network Error')
            } else {
                console.log(error.response.data.message)
            }
        })
        
        if(tempFile != null){
            if(tempFile.size > 2000000){
                let chunkSize = 2000000
                const convertedFile = await toBase64(tempFile)
                let fileSize = convertedFile.length
        
                let chunks = Math.ceil(fileSize/chunkSize, chunkSize)
                
                for(let i = 0; i < chunks; i++){
                    let index = i
                    const file = await DivideFile(convertedFile, chunkSize, i)

                    const filePayload = { index, name, lowerName, file }
                    
                    await api.saveFile(filePayload).then(res => {
                        console.log(`File uploaded successfully`)
                    }).catch(error => {
                        if (!error.response) {
                            console.log('Error: Network Error')
                        } else {
                            console.log(error.response.data.message)
                        }
                    })
                }
                
            }
        }
    }

    render(){
        const { name, description, filename } = this.state
        return(
            <Wrapper>
                <Title>Add</Title>

                <Label>Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />

                <Label>Description: </Label>
                <InputText
                    type="text"
                    value={description}
                    onChange={this.handleChangeInputDescription}
                />

                <br/>
                <Label>File: {filename}</Label>
                <br/>
                <input
                    type="file"
                    onChange={this.handleChangeInputFile}
                />
                <br/>

                <Button onClick={this.handleIncludeMeme}>Add Meme</Button>
                <CancelButton href={'/memes/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

var encodeImageFileAsURL = function(file){
    return new Promise((resolve, reject) => {
        var reader = new FileReader()
        reader.onloadend = function() {
            resolve(reader.result)
        }
        reader.readAsDataURL(file)
    })
}

const DivideFile = (file, chunkSize, offset) => new Promise((resolve, reject) => {
    offset = offset * chunkSize

    let sliceLength = offset + chunkSize

    if(offset + chunkSize > file.length)
        sliceLength = file.length

    let slicedString = file.slice(offset, sliceLength)

    resolve(slicedString)
})

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
})

export default MemesInsert