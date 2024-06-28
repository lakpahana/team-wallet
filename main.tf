provider "aws" {
  region = "us-east-1"
}

data "aws_instances" "deploy_servers" {
  filter {
    name   = "tag:Name"
    values = ["DeployServer"]
  }
}

locals {
  create_deploy_server = length(data.aws_instances.deploy_servers.ids) > 0
}

resource "aws_instance" "my-ec2" {
  count         = local.create_deploy_server ? 1 : 0
  ami           = "ami-04b70fa74e45c3917"
  instance_type = "t2.medium"
  key_name      = "jenkins-sanjula"
  vpc_security_group_ids = ["sg-0f9c6cfdcb6404612"]

  tags = {
    Name = "DeployServer"
  }
}

output "instance_ip" {
  value = local.create_deploy_server ? aws_instance.my-ec2[0].public_ip : ""
}
