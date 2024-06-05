import React from "react";
import { ComponentStory, ComponentMeta, StoryFn } from "@storybook/react";
import ResetPassword from ".";

// You can learn about this: https://storybook.js.org/docs/react/writing-stories/introduction

export default {
  title: "ResetPassword",
  component: ResetPassword,
}

const Template: StoryFn<any> = (args) => <ResetPassword {...args} />;

export const ResetPasswordPage = Template.bind({});

ResetPasswordPage.args = {
  redirectLogin: () => {},
};