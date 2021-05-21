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

    handleUpdateMeme = async () => {
        const { id, name, lowerName, description } = this.state
        const payload = { name, lowerName, description }

        await api.updateMemeById(id, payload).then(res => {
            window.alert(`Meme updated successfully`)
            this.setState({
                name: '',
                lowerName: '',
                description: '',
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
        })
    }

    render() {
        const { name, description } = this.state
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

                <Button onClick={this.handleUpdateMeme}>Update</Button>
                <CancelButton href={'/memes/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default MemesUpdate