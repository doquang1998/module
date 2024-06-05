import React from "react";
import { ComponentStory, ComponentMeta, StoryFn } from "@storybook/react";
import ChangePassword from ".";
import { IProps } from "./ChangePassword";

// You can learn about this: https://storybook.js.org/docs/react/writing-stories/introduction

export default {
  title: "ChangePassword",
  component: ChangePassword,
};

const Template: StoryFn<IProps> = (args) => <ChangePassword {...args} />;

export const ChangePasswordPage = Template.bind({});

ChangePasswordPage.args = {
  isUser: false,
  redirectProfile: () => {
  },
};
