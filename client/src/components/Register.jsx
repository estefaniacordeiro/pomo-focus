import React from 'react';
import { Form, Input, Button } from 'antd';
import ACTION from '../constants';
import agent from '../agent';
import { connect } from 'react-redux';
import LoadingIcon from './LoadingIcon';
import '../css/Register.css';

// Docs of ant.design Form https://ant.design/components/form

const mapStateToProps = state => ({
  inProgress: state.common.inProgress,
  error: state.common.error
})

const mapDispatchToProps = dispatch => ({
  onSubmit: (email, password) => 
    dispatch({ type: ACTION.REGISTER, payload: agent.Auth.register(email, password) }),
  clearError: () => dispatch({ type: ACTION.CLEAR_ERROR })
})

const FormItem = Form.Item;

class RegistrationForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit(values.email, values.password);
      }
    });
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { inProgress, error, clearError } = this.props;

    if (error) {
      setTimeout( () => clearError(), 3000 );
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 1,
        },
      },
    };

    return (
      <div className="Register-container">
        <Form onSubmit={this.handleSubmit} >
          <FormItem {...formItemLayout} label="E-mail" >
            { getFieldDecorator('email', {
              rules: [{
                type: 'email', message: 'The input is not valid E-mail!',
              }, {
                required: true, message: 'Please input your E-mail!',
              }],

            })(<Input />) }
            { error ? <span className=".input-validate-error">{error}</span> : null }
          </FormItem>

          <FormItem {...formItemLayout} label="Password" >
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: 'Please input your password!',
              }, {
                validator: this.validateToNextPassword,
              }],
            })(
              <Input type="password" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="Confirm Password" >
            { getFieldDecorator('confirm', {
              rules: [{
                required: true, message: 'Please confirm your password!',
              }, {
                validator: this.compareToFirstPassword,
              }],
            })(
              <Input type="password" onBlur={this.handleConfirmBlur} />
            ) }
          </FormItem>

          <FormItem {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" disabled={inProgress}>Sign Up</Button>
            <LoadingIcon show={inProgress} />
          </FormItem>

        </ Form>
      </div>
    )
  }
}

RegistrationForm = connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);

const Register = Form.create()(RegistrationForm);

export default Register;