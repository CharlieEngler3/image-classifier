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
            description: '',
            filename: '',
            file: '',
        }
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputDescription = async event => {
        const description = event.target.value
        this.setState({ description })
    }
    
    handleChangeInputFile = async event => {
        let file = event.target.files[0]

        await encodeImageFileAsURL(file).then(response => {
            file = response
        })

        this.setState({ file })

        const filename = event.target.value.substring(12, event.target.value.length-4)
        this.setState({ filename })
    }

    handleIncludeMeme = async () => {
        const { name, description, filename, file } = this.state
        const payload = { name, description, filename, file }

        await api.insertMeme(payload).then(res => {
            window.alert(`Meme inserted successfully`)
            this.setState({
                name: '',
                description: '',
                filename: '',
                file: '',
            })

            window.location.href = "/memes/list"
        }).catch(error => {
            if (!error.response) {
                console.log('Error: Network Error')
            } else {
                console.log(error.response.data.message)
            }
        })
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

export default MemesInsert