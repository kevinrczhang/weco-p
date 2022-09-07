import React, { Component } from "react";
import { render } from "react-dom";

export default class ToBeChanged extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loaded: false,
            placeholder: "Loading"
        };
    }

    componentDidMount() {
        // fetch("api.wecoapp.org/posts/post-view-set/")
        //     .then(response => {
        //         if (response.status > 400) {
        //             return this.setState(() => {
        //                 return { placeholder: "Something went wrong!" };
        //             });
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         console.log('data=', data);
        //         this.setState(() => {
        //             return {
        //                 data,
        //                 loaded: true
        //             };
        //     });
        // });
    }

    render() {
        return (
        
            <ul>
                {/* {this.state.data.map(post => {
                return (
                    <li key={post.id}>
                    {post.title} - {post.text} - {post.author}
                    <img src={post.image}></img>
                    </li>
                );
                })} */}
                hello
            </ul>

        );
    }
}

// const appDiv = document.getElementById("app");
// render(<App />, appDiv);