import React, { Component } from 'react'
import api from '../api'

import '../style/style.css'

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
    margin-left: -850px;
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

const SearchBar = styled.input.attrs({
    className:'form-control',
})`
    cursor: text;
    border: 1px solid black;
`

const SearchReload = styled.input.attrs({
    className:'form-control',
})`
    cursor: pointer;
    background-color: #cdcdcd;
    color: #000000;
`

const SearchSubmit = styled.input.attrs({
    className:'form-control',
})`
    cursor: pointer;
    background-color: #6cd649;
    color: #000000;
`

class Search extends Component {
    constructor(props){
        super(props)
        this.state = {
            term: ''
        }
    }

    handleChangeInputSearch = async event => {
        const term = event.target.value
        this.setState({ term })
    }

    render(){
        const term = this.state.term

        let isTerm = false
        if(term.length > 0)
            isTerm = true

        return <div>
            <SearchBar
                type="text"
                value={term}
                onChange={this.handleChangeInputSearch}
            />
            {isTerm && (
                <SearchSubmit 
                    type="submit"
                    value="Search"
                    onClick={() => this.props.go(term)}
                />
            )}
            {/*🗘*/}
            <SearchReload 
                type="submit"
                value="Reload Table"
                onClick={this.props.reloadTable}
            />
        </div>
    }
}

class Table extends Component {
    render() {
        return <table className="table">
            <thead>
                <tr>
                    {this.props.columns.map(columns => (
                        <th key={columns.Header}>{columns.Header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {this.props.data.map(data => {
                    return <tr key={data._id}>
                        <td>
                            {data._id}
                        </td>
                        <td>
                            {data.name}
                        </td>
                        <td>
                            {data.description}
                        </td>
                        <td>
                            {data.filename}
                        </td>
                        <td width="120px">
                            {<ImageHandler filename={data.filename} file={data.file} />}
                        </td>
                        <td>
                            {<DeleteMeme id={data._id} />}
                        </td>
                        <td>
                            {<UpdateMeme id={data._id} />}
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    }
}

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
        }
        this.searchGo = this.searchGo.bind(this)
    }
    
    searchGo = async (term) => {
        await api.searchMeme(term).then(memes => {

            console.log("Search Go function returned: %o", memes)

            this.setState({
                memes: memes.data.data,
            })
        }).catch(error => {
            this.componentDidMount()
        })
    }

    reloadTable = async () => {
        await api.getAllMemes().then(memes => {
            this.setState({
                memes: memes.data.data,
            })
        })
    }

    componentDidMount = async () => {
        await api.getAllMemes().then(memes => {
            this.setState({
                memes: memes.data.data,
            })
        })
    }

    render() {
        const { memes } = this.state

        const columns = [
            {
                Header: 'ID',
                accessor: '_id',
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
            },
            {
                Header: 'Delete',
                accessor: 'delete',
            },
            {
                Header: 'Update',
                accessor: 'update',
            },
        ]

        let showTable = true
        if (!memes.length) {
            showTable = false
        }

        return (
            <Wrapper>
                <Search reloadTable={this.reloadTable} go={this.searchGo}/>
                {showTable && (
                    <Table
                        columns={columns}
                        data={memes}
                    />
                )}
            </Wrapper>
        )
    }
}

export default MemesList