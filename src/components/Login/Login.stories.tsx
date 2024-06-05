import React from "react";
import { ComponentStory, ComponentMeta, StoryFn } from "@storybook/react";
import Login from "./";
import { IProps } from "./Login";

// You can learn about this: https://storybook.js.org/docs/react/writing-stories/introduction

export default {
  title: "Login",
  component: Login,
}

const Template: StoryFn<IProps> = (args : IProps) => <Login {...args} />;

export const LoginPage = Template.bind({});

LoginPage.args = {
  redirectSuccessLogin: () => {},
  redirectSignUp: () => {},
  redirectForgotPassword: () => {},
};