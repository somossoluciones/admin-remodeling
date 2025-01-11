/*
  # Rename quotations to projects

  1. Changes
    - Rename quotations table to projects
    - Rename quotation_items table to project_items
    - Update foreign key references
*/

-- Rename quotations table to projects
ALTER TABLE IF EXISTS quotations RENAME TO projects;

-- Rename quotation_items table to project_items
ALTER TABLE IF EXISTS quotation_items RENAME TO project_items;

-- Update foreign key reference in project_items
ALTER TABLE IF EXISTS project_items 
  RENAME COLUMN quotation_id TO project_id;