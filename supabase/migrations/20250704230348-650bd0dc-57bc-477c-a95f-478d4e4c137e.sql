-- Insert slide templates from JSON schema
INSERT INTO public.slide_templates (name, output_schema, prompt_template, md_template) VALUES
(
  'Section Header',
  '{"$schema": "http://json-schema.org/draft-07/schema#", "type": "object", "properties": {"section_title": {"type": "string", "description": "Heading for this section"}}, "required": ["section_title"], "additionalProperties": false}'::jsonb,
  'Create a section header slide with a clear, compelling heading that introduces the following section of the presentation. The section title should be concise but descriptive, setting the stage for the content that follows.',
  '# {{section_title}}'
),
(
  'Bullet List',
  '{"$schema": "http://json-schema.org/draft-07/schema#", "type": "object", "properties": {"title": {"type": "string", "description": "Title or prompt for the list"}, "bullets": {"type": "array", "items": {"type": "string"}, "description": "An array of bullet-point items"}}, "required": ["title", "bullets"], "additionalProperties": false}'::jsonb,
  'Create a bullet list slide with a clear title and a series of concise, impactful bullet points. Each bullet should be brief but informative, highlighting key points or takeaways.',
  '## {{title}}

{{#each bullets}}
- {{this}}
{{/each}}'
),
(
  'Image Slide',
  '{"$schema": "http://json-schema.org/draft-07/schema#", "type": "object", "properties": {"title": {"type": "string", "description": "Caption or heading for the image"}, "image_url": {"type": "string", "format": "uri", "description": "URL of the image to display"}, "caption": {"type": "string", "description": "Optional caption text", "optional": true}}, "required": ["title", "image_url"], "additionalProperties": false}'::jsonb,
  'Create an image slide with a descriptive title and relevant image. Include an optional caption if it adds value to the understanding of the image.',
  '## {{title}}

![{{title}}]({{image_url}})

{{#if caption}}
*{{caption}}*
{{/if}}'
),
(
  'Simple Title Slide',
  '{"$schema": "http://json-schema.org/draft-07/schema#", "type": "object", "properties": {"title": {"type": "string", "description": "Main heading of the presentation"}, "subtitle": {"type": "string", "description": "Subheading or tagline", "optional": true}}, "required": ["title"], "additionalProperties": false}'::jsonb,
  'Create a simple, clean title slide with a main heading and optional subtitle. The title should be compelling and clearly communicate the main topic of the presentation.',
  '# {{title}}

{{#if subtitle}}
## {{subtitle}}
{{/if}}'
),
(
  'Conclusion Slide',
  '{"$schema": "http://json-schema.org/draft-07/schema#", "type": "object", "properties": {"summary_points": {"type": "array", "items": {"type": "string"}, "description": "Key takeaways or action items"}}, "required": ["summary_points"], "additionalProperties": false}'::jsonb,
  'Create a conclusion slide that summarizes the key takeaways from the presentation. Focus on the most important points and any action items for the audience.',
  '## Key Takeaways

{{#each summary_points}}
- {{this}}
{{/each}}'
);