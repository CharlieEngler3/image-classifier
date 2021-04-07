import React, { Component } from 'react'
import api from '../api'
import ReactTable from "react-table-6";  
import "react-table-6/react-table.css"

import styled from 'styled-components'

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

const Popup = styled.div`
    cursor: pointer;
    position: absolute;
    margin-left: -600px;
    margin-top: -100px;
    z-index: 2;
    box-shadow: 0px 0px 100px 10px #111111;
`

const ImageButton = styled.div`
    cursor: pointer;
    position: absolute;
    width: 100px;
    height: 77px;
    clip: rect(0px, 100px, 77px, 0px);
    z-index: 1;
`

class UpdateMeme extends Component {
    updateUser = event => {
        event.preventDefault()

        window.location.href = `/memes/update/${this.props.id}`
    }

    render() {
        return <Update onClick={this.updateUser}>Update</Update>
    }
}

class DeleteMeme extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do you want to delete the meme ${this.props.id} permanently?`,
            )
        ) {
            api.deleteMemeById(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
    }
}

class ImageHandler extends Component {
    state = {
        seen: true
    }

    togglePopup = () => {
        this.setState({
            seen: !this.state.seen
        })
    }

    render() {
        return  <div>
                    {!this.state.seen ? <Popup onClick={this.togglePopup}>
                        <img
                            alt={this.props.filename}
                            src={this.props.file}
                            width="1000px"
                            height="auto"
                        />
                    </Popup> : <ImageButton onClick={this.togglePopup}>
                        <img
                            alt={this.props.filename}
                            src={this.props.file}
                            width="100px"
                            height="auto"
                        />
                    </ImageButton>}
                    <br/>
                    <br/>
                    <br/>
                </div>
    }
}

class MemesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            memes: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllMemes().then(memes => {
            this.setState({
                memes: memes.data.data,
            })
        })

        this.setState({ isLoading: false })
    }

    render() {
        const { memes, isLoading } = this.state

        const columns = [
            {
                Header: 'ID',
                accessor: '_id',
                filterable: true,
            },
            {
                Header: 'Name',
                accessor: 'name',
                filterable: true,
            },
            {
                Header: 'Description',
                accessor: 'description',
                filterable: true,
            },
            {
                Header: 'File Name',
                accessor: 'filename',
            },
            {
                Header: 'File',
                accessor: 'file',
                Cell: function(props){
                    return(
                        <div>
                            <div width="100px">
                                <ImageHandler filename={props.original.filename} file={props.original.file} />
                            </div>
                        </div>
                    )
                }
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <DeleteMeme id={props.original._id} />
                        </span>
                    )
                },
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span>
                            <UpdateMeme id={props.original._id} />
                        </span>
                    )
                },
            },
        ]

        let showTable = true
        if (!memes.length) {
            showTable = false
        }

        return (
            <Wrapper>
                {showTable && (
                    <ReactTable
                        data={memes}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default MemesList