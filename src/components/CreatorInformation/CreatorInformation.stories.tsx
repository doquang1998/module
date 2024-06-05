import React from "react";
import { ComponentStory, ComponentMeta, StoryFn } from "@storybook/react";
import CreatorInformation from ".";
import { IProps } from "./CreatorInformation";

// You can learn about this: https://storybook.js.org/docs/react/writing-stories/introduction

export default {
  title: "CreatorInformation",
  component: CreatorInformation,
}

const Template: StoryFn<IProps> = (args) => <CreatorInformation {...args} />;

export const CreatorInformationPage = Template.bind({});

CreatorInformationPage.args = {
  title: null,
  biography: null,
  handleUpdateProfile: () => {},
};