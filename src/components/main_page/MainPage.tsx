import React from "react";

interface IProps {}

export class MainPage extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
    }

    public render() {
        return ( <div> 메인 페이지 </div> );
    }
}
