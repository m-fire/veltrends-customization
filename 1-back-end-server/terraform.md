#### `powered by Bing`

## Terraform: 인프라 코드관리 도구

### Terraform 설치

```bash
# 설치
$ brew install terraform
# 설치 확인
$ terraform version
Terraform v0.12.23
```

### Terraform 코드작성
Terraform 코드는 HCL(HashiCorp Configuration Language)이라는 언어로 작성되며, `*.tf` 확장자를 가집니다. Terraform 코드는 provider, resource, variable 등의 요소로 구성됩니다.

* provider: Terraform 의 대상 인프라 서비스나 플랫폼 지정
* resource: 인프라의 구성요소 정의
* variable: Terraform 코드에서 사용할 변수 선언.

### 예) AWS에서 EC2 인스턴스 생성코드

```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "example" {
  ami           = "ami-2757f631"
  instance_type = "t2.micro"
}
```

이 코드는 AWS의 us-east-1 리전에 t2.micro 타입의 EC2 인스턴스를 생성하도록 지시합니다. ami는 Amazon Machine Image의 약자로, EC2 인스턴스의 운영체제나 소프트웨어를 결정하는 것입니다³.

### Terraform 코드 적용
우선 CLI를 통해 `terraform init` 명령을 실행합니다. init 단계에서는 먼저 provider에 맞는 플러그인을 다운받고, 기존 인프라 상태를 가져올 수 있는지 확인합니다¹.

```bash
$ terraform init
```

### 실행될 작업수행 확인
init이 완료되면 `terraform plan` 명령을 실행하여 Terraform 코드가 실제로 어떤 작업을 수행할지 미리 확인할 수 있습니다. plan 단계에서는 Terraform 코드와 현재 인프라의 차이점을 분석하고, 생성, 변경, 삭제할 리소스를 보여줍니다⁴.

```bash
$ terraform plan
```

### Terraform 코드적용
plan이 정상적으로 완료되면 `terraform apply` 명령을 실행하여 Terraform 코드를 실제로 적용할 수 있습니다. apply 단계에서는 plan 단계에서 보여준 작업을 수행하고, 인프라의 상태를 저장합니다⁴.

```bash
$ terraform apply
```

apply가 성공적으로 완료되면 Terraform 코드에 정의된 인프라가 생성되었음을 확인할 수 있습니다. 이제 Terraform을 통해 인프라를 코드로 관리할 수 있습니다. Terraform에 대해 더 자세히 알고 싶다면 공식 문서⁵를 참고하세요.


#### 참고
Source: Conversation with Bing, 2023. 2. 16.(1) 테라폼(Terraform) 기초 튜토리얼: AWS로 시작하는 Infrastructure as Code. https://www.44bits.io/ko/post/terraform_introduction_infrastrucute_as_code Accessed 2023. 2. 16..
(2) Terraform 시작하기. Infrastructure of Code (이하 IoC) 도구로… | by Smart .... https://medium.com/@jyson88/terraform-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-572461ba5fde Accessed 2023. 2. 16..
(3) 좌충우돌 Terraform 입문기 | 우아한형제들 기술블로그. https://techblog.woowahan.com/2646/ Accessed 2023. 2. 16..
(4) Terraform by HashiCorp. https://www.terraform.io/ Accessed 2023. 2. 16..
(5) 좌충우돌 Terraform 입문기 | 우아한형제들 기술블로그. https://techblog.woowahan.com/2646/ Accessed 2023. 2. 16..
