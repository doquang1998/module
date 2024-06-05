import React from "react";
import { ComponentStory, ComponentMeta, StoryFn } from "@storybook/react";
import SignUp from "./";
import { IProps } from "./SignUp";

// You can learn about this: https://storybook.js.org/docs/react/writing-stories/introduction

export default {
  title: "SignUp",
  component: SignUp,
}

const Template: StoryFn<IProps> = (args : IProps) => <SignUp {...args} />;

export const SignUpPage = Template.bind({});

SignUpPage.args = {
  redirectLogin: () => {},
};