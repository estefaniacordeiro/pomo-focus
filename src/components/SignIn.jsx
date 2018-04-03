import React from 'react';
import LoadingIcon from './LoadingIcon';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { connect } from 'react-redux';
import ACTION from '../constants';
import agent from '../agent';

const FormItem = Form.Item;

const mapStateToProps = state => ({
  inProgress: state.common.inProgress,
  error: state.common.error
})

const mapDispatchToProps = dispatch => ({
  logIn: (email, password) => 
    dispatch({ type: ACTION.LOGIN, payload: agent.Auth.login(email, password)}),
})

class SignInForm extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.logIn(values.email, values.password);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { inProgress } = this.props;
    return (
      <div className="SignIn-container">
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button" disable={inProgress.toString()}>
              Sign in
            </Button>
            <LoadingIcon show={inProgress} />
          </FormItem>
        </Form>
      </div>
    );
  }
}

SignInForm = connect(mapStateToProps, mapDispatchToProps)(SignInForm);

const SignIn = Form.create()(SignInForm);

export default SignIn;