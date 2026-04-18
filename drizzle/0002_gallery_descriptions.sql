UPDATE "projects"
SET "gallery" = CASE
  WHEN jsonb_typeof("gallery") = 'array'
    AND jsonb_array_length("gallery") > 0
    AND jsonb_typeof("gallery"->0) = 'string'
  THEN COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'image',
          item,
          'description',
          jsonb_build_object('en', '', 'pl', '')
        )
      )
      FROM jsonb_array_elements_text("gallery") AS item
    ),
    '[]'::jsonb
  )
  WHEN jsonb_typeof("gallery") = 'array' THEN "gallery"
  ELSE '[]'::jsonb
END;
