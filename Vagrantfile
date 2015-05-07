Vagrant.configure("2") do |config|
  config.vm.box = "lithium.local.favish.com"
  config.vm.box_url = "http://www.favish.com/boxes/lithium.local.favish.com.box"
  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--memory", 2048]
  end

  project = File.expand_path(File.dirname(__FILE__)).split("/").last;

  config.vm.synced_folder ".", "/home/vagrant/project",
    :nfs => true,
    :mount_options => ['nolock,vers=3,udp,noatime,actimeo=1']

  if File.directory?(File.join(__dir__, ".drush"))
    config.vm.synced_folder "./.drush", "/home/vagrant/.drush",
      :nfs => true,
      :mount_options => ['nolock,vers=3,udp,noatime,actimeo=1']
  end

  config.vm.provision "file", source: "~/.gitconfig", destination: ".gitconfig"

  config.vm.hostname = "#{project}.local.favish.com"

  config.ssh.forward_agent  = true
  config.ssh.insert_key = false
  config.vm.network :private_network, ip: "10.33.36.11"
end
