require 'xcodeproj'

project_path = File.join(__dir__, 'FitGo.xcodeproj')
project = Xcodeproj::Project.open(project_path)

# Find the main FitGo target
target = project.targets.find { |t| t.name == 'FitGo' }
abort("Could not find FitGo target!") unless target

# Find or create the FitGo group
main_group = project.main_group.children.find { |g| g.display_name == 'FitGo' }
unless main_group
  main_group = project.main_group
end

files_to_add = [
  { path: 'MusicPlayer.swift', type: :source },
  { path: 'MusicPlayer.m', type: :source },
  { path: 'FitGo-Bridging-Header.h', type: :header },
]

files_to_add.each do |file_info|
  file_path = file_info[:path]
  full_path = File.join(__dir__, file_path)
  
  unless File.exist?(full_path)
    puts "WARNING: #{full_path} does not exist, skipping."
    next
  end

  # Check if already added
  existing = main_group.files.find { |f| f.display_name == file_path }
  if existing
    puts "#{file_path} already in project, skipping."
    next
  end

  # Add file reference
  file_ref = main_group.new_file(full_path)
  puts "Added #{file_path} to project group."

  # Add to target's build phase if it's a source file
  if file_info[:type] == :source
    target.source_build_phase.add_file_reference(file_ref)
    puts "Added #{file_path} to build sources."
  end
end

# Set the bridging header in build settings
target.build_configurations.each do |config|
  config.build_settings['SWIFT_OBJC_BRIDGING_HEADER'] = '$(SRCROOT)/FitGo-Bridging-Header.h'
  puts "Set bridging header for configuration: #{config.name}"
end

project.save
puts "\nDone! Project saved successfully."
