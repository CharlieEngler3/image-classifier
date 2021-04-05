import React, { Component } from 'react'
import api from '../api'

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
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

class MemesUpdate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
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

        const filename = event.target.value
        this.setState({ filename })
    }

    handleUpdateMeme = async () => {
        const { id, name, description, filename, file } = this.state
        const payload = { name, description, filename, file }

        await api.updateMemeById(id, payload).then(res => {
            window.alert(`Meme updated successfully`)
            this.setState({
                name: '',
                description: '',
                filename: '',
                file: '',
            })

            window.location.href = "/memes/list"
        })
    }

    componentDidMount = async () => {
        const { id } = this.state
        const meme = await api.getMemeById(id)

        this.setState({
            name: meme.data.data.name,
            description: meme.data.data.description,
            filename: meme.data.data.filename,
            file: meme.data.data.file,
        })
    }

    render() {
        const { name, description, filename } = this.state
        return (
            <Wrapper>
                <Title>Update</Title>

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

                <Label>File Name: </Label>
                <InputText
                    type="text"
                    value={filename}
                    onChange={this.handleChangeInputFile}
                />

                <Label>File: </Label>
                <InputText
                    type="file"
                    onChange={this.handleChangeInputFile}
                />

                <Button onClick={this.handleUpdateMeme}>Update Meme</Button>
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

export default MemesUpdate