import React from "react";
import { ComponentStory, ComponentMeta, StoryFn } from "@storybook/react";
import ForgotPassword from ".";

// You can learn about this: https://storybook.js.org/docs/react/writing-stories/introduction

export default {
  title: "ForgotPassword",
  component: ForgotPassword,
}

const Template: StoryFn<any> = (args) => <ForgotPassword {...args} />;

export const ForgotPasswordPage = Template.bind({});