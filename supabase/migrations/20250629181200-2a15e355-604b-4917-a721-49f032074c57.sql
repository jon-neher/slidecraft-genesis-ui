-- bulk-create common slide templates (generic names, Reveal-style separators)
BEGIN;

INSERT INTO public.slide_templates (name, prompt_template, output_schema, md_template) VALUES
(
  'Title Slide',
  $$Create a title slide with main title "{{title}}", subtitle "{{subtitle}}", and an optional logo URL "{{logo_url}}".$$,
  $${
    "type": "object",
    "properties": {
      "title":     { "type": "string" },
      "subtitle":  { "type": "string" },
      "logo_url":  { "type": "string" }
    },
    "required": ["title","subtitle"]
  }$$::jsonb,
  $$---
# {{title}}

#### {{subtitle}}

{{#logo_url}}![Logo]({{logo_url}}){{/logo_url}}
$$
),
(
  'Agenda',
  $$Generate an agenda slide with an array "items" listing each agenda point in order.$$,
  $${
    "type": "object",
    "properties": {
      "items": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["items"]
  }$$::jsonb,
  $$---
# Agenda

{{#items}}
1. {{.}}
{{/items}}
$$
),
(
  'Problem Statement',
  $$Create a slide titled "Problem Statement" with up to three bullet points under "problems".$$,
  $${
    "type": "object",
    "properties": {
      "problems": {
        "type": "array",
        "items": { "type": "string" },
        "maxItems": 3
      }
    },
    "required": ["problems"]
  }$$::jsonb,
  $$---
# Problem Statement

{{#problems}}
- {{.}}
{{/problems}}
$$
),
(
  'Solution Overview',
  $$Create a slide titled "Our Solution" with a short description in "description" and up to four bullet points under "benefits".$$,
  $${
    "type": "object",
    "properties": {
      "description": { "type": "string" },
      "benefits": {
        "type": "array",
        "items": { "type": "string" },
        "maxItems": 4
      }
    },
    "required": ["description","benefits"]
  }$$::jsonb,
  $$---
# Our Solution

{{description}}

{{#benefits}}
- {{.}}
{{/benefits}}
$$
),
(
  'Features & Benefits',
  $$Generate a slide with two parallel lists: "features" (array of strings) and matching "benefits" (array of strings).$$,
  $${
    "type": "object",
    "properties": {
      "features": { "type": "array", "items": { "type": "string" } },
      "benefits": { "type": "array", "items": { "type": "string" } }
    },
    "required": ["features","benefits"]
  }$$::jsonb,
  $$---
# Features & Benefits

| Feature | Benefit |
|---------|---------|
{{#features}}
| {{.}} | {{benefits.[@index]}} |
{{/features}}
$$
),
(
  'Data Chart',
  $$Produce a slide titled "{{title}}" with "chart_description" and a URL "chart_url" pointing to the chart image.$$,
  $${
    "type": "object",
    "properties": {
      "title":             { "type": "string" },
      "chart_description": { "type": "string" },
      "chart_url":         { "type": "string", "format": "uri" }
    },
    "required": ["title","chart_description","chart_url"]
  }$$::jsonb,
  $$---
# {{title}}

![Chart]({{chart_url}})

*{{chart_description}}*
$$
),
(
  'Case Study',
  $$Create a slide titled "Case Study: {{client}}" with fields "challenge", "approach", and "results".$$,
  $${
    "type": "object",
    "properties": {
      "client":   { "type": "string" },
      "challenge":{ "type": "string" },
      "approach": { "type": "string" },
      "results":  { "type": "string" }
    },
    "required": ["client","challenge","approach","results"]
  }$$::jsonb,
  $$---
# Case Study: {{client}}

### Challenge

{{challenge}}

### Approach

{{approach}}

### Results

{{results}}
$$
),
(
  'Roadmap',
  $$Generate a timeline slide titled "Roadmap" with an ordered array "milestones" of objects {"phase","date","description"}.$$,
  $${
    "type": "object",
    "properties": {
      "milestones": {
        "type": "array",
        "items": {
          "type":"object",
          "properties": {
            "phase":       { "type": "string" },
            "date":        { "type": "string" },
            "description": { "type": "string" }
          },
          "required": ["phase","date","description"]
        }
      }
    },
    "required": ["milestones"]
  }$$::jsonb,
  $$---
# Roadmap

{{#milestones}}
- **{{phase}}** ({{date}}): {{description}}
{{/milestones}}
$$
),
(
  'Team',
  $$Create a slide titled "Meet the Team" with an array "members" of objects: {"name","role","photo_url"}.$$,
  $${
    "type": "object",
    "properties": {
      "members": {
        "type": "array",
        "items": {
          "type":"object",
          "properties": {
            "name":      { "type": "string" },
            "role":      { "type": "string" },
            "photo_url": { "type": "string", "format": "uri" }
          },
          "required": ["name","role"]
        }
      }
    },
    "required": ["members"]
  }$$::jsonb,
  $$---
# Meet the Team

{{#members}}
![{{name}}]({{photo_url}}){ width=100 }

#### {{name}}

{{role}}

{{/members}}
$$
),
(
  'Next Steps',
  $$Create a slide titled "Next Steps" with an array "actions" (strings) and optional "email" and "phone" contacts.$$,
  $${
    "type": "object",
    "properties": {
      "actions": { "type": "array", "items": { "type": "string" } },
      "email":   { "type": "string", "format": "email" },
      "phone":   { "type": "string" }
    },
    "required": ["actions"]
  }$$::jsonb,
  $$---
# Next Steps

{{#actions}}
- {{.}}
{{/actions}}

{{#email}}Email: {{email}}

{{/email}}{{#phone}}Phone: {{phone}}
{{/phone}}
$$
);

COMMIT;

