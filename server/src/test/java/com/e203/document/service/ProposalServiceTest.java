package com.e203.document.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.e203.document.collection.ApiDocs;
import com.e203.document.collection.FunctionDescription;
import com.e203.document.collection.Proposal;
import com.e203.document.dto.response.ApiDocsResponseDto;
import com.e203.document.dto.response.FunctionDescriptionResponseDto;
import com.e203.document.dto.response.ProposalResponseDto;

@SpringBootTest
public class ProposalServiceTest {

	@Autowired
	ProposalService proposalService;
	@Autowired
	private ApiDocsService apiDocsService;
	@Autowired
	private FunctionDescriptionService functionDescriptionService;

	@Test
	public void contentToObject() {
		ProposalResponseDto proposalResponseDto = proposalService.parseStringToObject(1);
		ApiDocsResponseDto apiDocsResponseDto = apiDocsService.parseStringToObject(1);
		FunctionDescriptionResponseDto functionDescriptionResponseDto = functionDescriptionService.parseStringToObject(1);
		System.out.println(proposalResponseDto);
		System.out.println(apiDocsResponseDto);
		System.out.println(functionDescriptionResponseDto);
	}

	@Test
	public void create(){
		Proposal proposal = proposalService.saveProposal(1);
		ApiDocs apiDocs = apiDocsService.saveApiDocs(1);
		FunctionDescription functionDescription = functionDescriptionService.saveFuncDesc(1);

	}
}
