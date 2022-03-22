import { Component } from 'react';
import { Layout } from 'antd';

// Header, Footer, Sider, The Content component is under the Layout component module
const { Header, Footer, Sider, Content } = Layout;

class BasicLayout extends Component {
    render() {
        return (
            <Layout>
                <Sider width={256} style={{ minHeight: '100vh', background: 'lightgray' }}>
                    Sider
                </Sider>
                <Layout >
                    <Header style={{ background: 'lightblue', textAlign: 'center', padding: 0 }}>Header</Header>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                            {this.props.children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center', padding: '20px' }}>2022 Created by AGE</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default BasicLayout;
